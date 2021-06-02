const chalk = require('chalk');

const { GATEWAY, MONOLITH, MICROSERVICE } = require('generator-jhipster/jdl/jhipster/application-types');
const { appDefaultConfig } = require('generator-jhipster/generators/generator-defaults');
const askForModuleNameValidator = require('../utils').askForModuleNameValidator;

module.exports = {
    askForModuleName: askForModuleName,
    askForApplicationTypeWithUaa: askForApplicationTypeWithUaa,
};

async function askForModuleName() {
    if (this.existingProject) return undefined;
    console.log('custom app name');

    const defaultAppBaseName = this.getDefaultAppName();
    const applicationType = this.jhipsterConfig.applicationType;
    const answers = await this.prompt(askForModuleNameValidator(applicationType, defaultAppBaseName));

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
