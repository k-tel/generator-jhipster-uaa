/* eslint-disable consistent-return */
const chalk = require('chalk');
const ClientGenerator = require('generator-jhipster/generators/client');
const writeFiles = require('./files').writeFiles;

module.exports = class extends ClientGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint uaa')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // This sets up options for this sub generator and is being reused from JHipster
        // jhContext.setupClientOptions(this, jhContext);
    }

    get initializing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get loading() {
        const phaseFromJHipster = super._loading();

        const customPhases = {
            validateSkipServer() {
                if (
                    this.jhipsterConfig.skipServer &&
                    !(
                        this.jhipsterConfig.databaseType &&
                        this.jhipsterConfig.devDatabaseType &&
                        this.jhipsterConfig.prodDatabaseType &&
                        this.jhipsterConfig.authenticationType
                    )
                ) {
                    this.error(
                        `When using skip-server flag, you must pass a database option and authentication type using ${chalk.yellow(
                            '--db'
                        )} and ${chalk.yellow('--auth')} flags`
                    );
                    if (this.jhipsterConfig.skipServer && this.jhipsterConfig.authenticationType === 'uaa' && !this.jhipsterConfig.uaaBaseName) {
                        this.error(
                            `When using skip-server flag and UAA as authentication method, you must pass a UAA base name using ${chalk.yellow(
                                '--uaa-base-name'
                            )} flag`
                        );
                    }
                }
            },
        }

        return { ...phaseFromJHipster, ...customPhases };
    }

    get preparing() {
        const phasesFromJHipster = this._preparing();

        const customPhases = {
           prepareUaa() {
               this.apiUaaPath = `${this.authenticationType === 'uaa' ? `services/${this.uaaBaseName.toLowerCase()}/` : ''}`;
               if (this.authenticationType === 'oauth2' || (this.databaseType === 'no' && this.authenticationType !== 'uaa')) {
                   this.skipUserManagement = true;
               }
           }
        }

        return { ...phasesFromJHipster, ...customPhases };
    }

    get prompting() {
        // The prompting phase is being overriden so that we can ask our own questions
        // return {
        //     askForClient: prompts.askForClient,
        //     askForClientSideOpts: prompts.askForClientSideOpts,

        //     setSharedConfigOptions() {
        //         this.configOptions.lastQuestion = this.currentQuestion;
        //         this.configOptions.totalQuestions = this.totalQuestions;
        //         this.configOptions.clientFramework = this.clientFramework;
        //         this.configOptions.useSass = this.useSass;
        //     }
        // };
        // If the prompts need to be overriden then use the code commented out above instead

        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._prompting();
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        // The writing phase is being overriden so that we can write our own templates as well.
        // If the templates doesnt need to be overrriden then just return `super._writing()` here
        const phaseFromJHipster = super._writing();
        const customPhaseSteps = {
            writeAdditionalFile() {
                writeFiles.call(this);
            }
        };
        return Object.assign(phaseFromJHipster, customPhaseSteps);
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
