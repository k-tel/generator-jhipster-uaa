/* eslint-disable consistent-return */

const path = require('path');
const chalk = require('chalk');
const shelljs = require('shelljs');
const ServerGenerator = require('generator-jhipster/generators/server');
const customPrompts = require('./prompts');

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


        return jhipsterPrompts;
    }

    async askModuleName(generator) {
        const defaultAppBaseName = this.getDefaultAppName();
        console.log('OVERRIDDE');
        const answers = await generator.prompt({
            type: 'input',
            name: 'baseName',
            validate: input => {
                if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
                    return 'Your base name cannot contain special characters or a blank space';
                }
                if (generator.applicationType === 'microservice' && /_/.test(input)) {
                    return 'Your base name cannot contain underscores as this does not meet the URI spec';
                }
                if (input === 'application') {
                    return 'Your base name cannot be named \'application\' as this is a reserved name for Spring Boot';
                }
                return true;
            },
            message: 'What is the base name of your application?',
            default: defaultAppBaseName,
        });

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
        return super._writing();
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
                console.log('filteDatyn', fileDatum);
                return fileDatum;
            }
            return false;
        }
        return false;
    }
};
