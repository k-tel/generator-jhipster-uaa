module.exports = {
    askForModuleNameValidator: askForModuleNameValidator,
};

function askForModuleNameValidator(applicationType, defaultAppBaseName) {
    return {
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
    };
}
