/* eslint-disable consistent-return */

const path = require('path');
const chalk = require('chalk');
const shelljs = require('shelljs');
const ServerGenerator = require('generator-jhipster/generators/server');
const customPrompts = require('./prompts');
const writeFiles = require('./files').writeFiles;
const askForModuleNameValidator = require('../utils').askForModuleNameValidator;

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint uaa')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        // jhContext.setupServerOptions(this, jhContext);
    }

    get initializing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get prompting() {
        const jhipsterPrompts = super._prompting();
        jhipsterPrompts.askForServerSideOpts = customPrompts.askForServerSideOpts;
        jhipsterPrompts.askForModuleName = customPrompts.askForModuleName;


        return jhipsterPrompts;
    }

    async askModuleName(generator = this) {
        const defaultAppBaseName = this.getDefaultAppName();
        console.log('OVERRIDDE', this.prompt);
        const answers = await generator.prompt(askForModuleNameValidator(generator.applicationType, defaultAppBaseName));

        generator.baseName = generator.jhipsterConfig.baseName = answers.baseName;
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        const phaseFromJHipster = super._configuring();
        const customPhase = {
            validateConfig() {
                const authenticationType = this.jhipsterConfig.authenticationType;
                // run the original validation
                phaseFromJHipster.validateConfig.call(this);

                // now we revert setting auth type to JWT, when the user actually wants a UAA
                if (this.jhipsterConfig.applicationType === 'uaa' || authenticationType === 'uaa') {
                    this.jhipsterConfig.authenticationType = 'uaa';
                }
            },
        }

        return { ...phaseFromJHipster, ...customPhase};
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        const phaseFromJHipster = super._writing();
        const customPhase = writeFiles();

        return { ...phaseFromJHipster, ...customPhase };
    }

    get install() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._install();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }

    /**
     * Get UAA app name from path provided.
     * @param {string} input - path
     */
    getUaaAppData(input) {
        if (!input) return false;

        input = input.trim();
        let fromPath = '';
        if (path.isAbsolute(input)) {
            fromPath = `${input}/.yo-rc.json`;
        } else {
            fromPath = this.destinationPath(`${input}/.yo-rc.json`);
        }

        if (shelljs.test('-f', fromPath)) {
            const fileData = this.fs.readJSON(fromPath);
            if (fileData && fileData['generator-jhipster']) {
                let fileDatum = fileData['generator-jhipster'];
                return fileDatum;
            }
            return false;
        }
        return false;
    }
};
