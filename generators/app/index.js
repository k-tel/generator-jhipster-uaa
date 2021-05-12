/* eslint-disable consistent-return */
// import prompts from 'generator-jhipster/generators/app/prompts';

const { MICROSERVICE } = require('generator-jhipster/jdl/jhipster/application-types');
const chalk = require('chalk');
const AppGenerator = require('generator-jhipster/generators/app');
const prompts = require('generator-jhipster/generators/app/prompts');
const packagejs = require('../../package.json');
const customPropmts = require('./prompts');
const appDefaultConfig = require('generator-jhipster/generators/generator-defaults');

module.exports = class extends AppGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint uaa')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This adds support for a `--uaa-base-name` flag
        this.option('uaa-base-name', {
            desc: 'Provide the name of UAA server, when using --auth uaa and skipping server side generation',
            type: String,
        });
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `AppGenerator`
         *
         * There are multiple ways to customize a phase from JHipster.
         *
         * 1. Let JHipster handle a phase, blueprint doesnt override anything.
         * ```
         *      return super._initializing();
         * ```
         *
         * 2. Override the entire phase, this is when the blueprint takes control of a phase
         * ```
         *      return {
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *          myAnotherCustomInitPhaseStep(){
         *              // Do all your stuff here
         *          }
         *      };
         * ```
         *
         * 3. Partially override a phase, this is when the blueprint gets the phase from JHipster and customizes it.
         * ```
         *      const phaseFromJHipster = super._initializing();
         *      const myCustomPhaseSteps = {
         *          displayLogo() {
         *              // override the displayLogo method from the _initializing phase of JHipster
         *          },
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *      }
         *      return Object.assign(phaseFromJHipster, myCustomPhaseSteps);
         * ```
         */
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        // return super._prompting();
        console.log('Hey youu');
        return {
            askForInsightOptIn: prompts.askForInsightOptIn,
            askForApplicationType: customPropmts.askForApplicationTypeWithUaa,
            askForModuleName: customPropmts.askForModuleName
        };
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster

        const phaseFromJhipster = super._configuring();
        const customPhases = {
            setupUaa() {
                if (this.jhipsterConfig.applicationType === 'uaa') {
                    console.log('set UAA defaults');
                    this.jhipsterConfig.skipClient = true;
                    this.jhipsterConfig.skipUserManagement = false;
                    this.jhipsterConfig.authenticationType = 'uaa';
                }
            }
        };

        return { ...phaseFromJhipster, ...customPhases};
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
};
