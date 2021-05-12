const chalk = require('chalk');

const { GATEWAY, MONOLITH, MICROSERVICE } = require('generator-jhipster/jdl/jhipster/application-types');
const { appDefaultConfig } = require('generator-jhipster/generators/generator-defaults');

module.exports = {
    askForModuleName: askForModuleName,
    askForApplicationTypeWithUaa: askForApplicationTypeWithUaa,
};

async function askForModuleName() {
    if (this.existingProject) return undefined;
    console.log('custom app name');

    const defaultAppBaseName = this.getDefaultAppName();
    const applicationType = this.jhipsterConfig.applicationType;
    const answers = await this.prompt({
        type: 'input',
        name: 'baseName',
        validate: input => {
            if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
                return 'Your base name cannot contain special characters or a blank space';
            }
            if (applicationType === 'microservice' && /_/.test(input)) {
                return 'Your base name cannot contain underscores as this does not meet the URI spec';
            }
            if (applicationType === 'uaa' && input === 'auth') {
                return "Your UAA base name cannot be named 'auth' as it conflicts with the gateway login routes";
            }
            if (input === 'application') {
                return "Your base name cannot be named 'application' as this is a reserved name for Spring Boot";
            }
            return true;
        },
        message: 'What is the base name of your application?',
        default: defaultAppBaseName,
    });

    this.baseName = this.jhipsterConfig.baseName = answers.baseName;
}
async function askForApplicationTypeWithUaa() {
    if (this.existingProject) return;

    const applicationTypeChoices = [
        {
            value: MONOLITH,
            name: 'Monolithic application (recommended for simple projects)',
        },
        {
            value: GATEWAY,
            name: 'Gateway application',
        },
        {
            value: MICROSERVICE,
            name: 'Microservice application',
        },
        {
            value: 'uaa',
            name: 'JHipster UAA Server',
        },
    ];

    const answers = await this.prompt([
        {
            type: 'list',
            name: 'applicationType',
            message: `Which ${chalk.yellow('*type*')} of application would you like to create?`,
            choices: applicationTypeChoices,
            default: appDefaultConfig.applicationType,
        },
    ]);
    this.applicationType = this.jhipsterConfig.applicationType = answers.applicationType;
}
