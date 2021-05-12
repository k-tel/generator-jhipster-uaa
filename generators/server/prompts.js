
const chalk = require('chalk');
const constants = require('generator-jhipster/generators/generator-constants');
const {serverDefaultConfig} = require('generator-jhipster/generators/generator-defaults');

module.exports = {
    askForServerSideOpts: askForServerSideOpts,
};


function askForServerSideOpts() {
    if (this.existingProject) return undefined;

    const applicationType = this.jhipsterConfig.applicationType;
    const uaaBaseName = this.jhipsterConfig.uaaBaseName;
    let defaultPort = applicationType === 'gateway' ? '8080' : '8081';
    if (applicationType === 'uaa') {
        defaultPort = '9999';
    }
    const prompts = [
        {
            when: () => ['gateway', 'monolith', 'microservice'].includes(applicationType),
            type: 'confirm',
            name: 'reactive',
            message: '[Beta] Do you want to make it reactive with Spring WebFlux?',
            default: serverDefaultConfig.reactive,
        },
        {
            when: () => applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa',
            type: 'input',
            name: 'serverPort',
            validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
            message:
                'As you are running in a microservice architecture, on which port would like your server to run? It should be unique to avoid port conflicts.',
            default: defaultPort,
        },
        {
            type: 'input',
            name: 'packageName',
            validate: input =>
                /^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)
                    ? true
                    : 'The package name you have provided is not a valid Java package name.',
            message: 'What is your default Java package name?',
            default: serverDefaultConfig.packageName,
            store: true,
        },
        {
            when: () => applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa',
            type: 'list',
            name: 'serviceDiscoveryType',
            message: 'Which service discovery server do you want to use?',
            choices: [
                {
                    value: 'eureka',
                    name: 'JHipster Registry (uses Eureka, provides Spring Cloud Config support and monitoring dashboards)',
                },
                {
                    value: 'consul',
                    name: 'Consul',
                },
                {
                    value: false,
                    name: 'No service discovery',
                },
            ],
            default: 'eureka',
        },
        {
            when: answers =>
                (applicationType === 'monolith' && answers.serviceDiscoveryType !== 'eureka') ||
                ['gateway', 'microservice'].includes(applicationType),
            type: 'list',
            name: 'authenticationType',
            message: `Which ${chalk.yellow('*type*')} of authentication would you like to use?`,
            choices: answers => {
                const opts = [
                    {
                        value: 'jwt',
                        name: 'JWT authentication (stateless, with a token)',
                    },
                ];
                opts.push({
                    value: 'oauth2',
                    name: 'OAuth 2.0 / OIDC Authentication (stateful, works with Keycloak and Okta)',
                });
                if (applicationType === 'monolith' && answers.serviceDiscoveryType !== 'eureka') {
                    opts.push({
                        value: 'session',
                        name: 'HTTP Session Authentication (stateful, default Spring Security mechanism)',
                    });
                }
                if (!answers.reactive) {
                    if (['gateway', 'microservice'].includes(applicationType)) {
                        opts.push({
                            value: 'uaa',
                            name: 'Authentication with JHipster UAA server (the server must be generated separately)',
                        });
                    }
                }
                return opts;
            },
            default: serverDefaultConfig.authenticationType,
        },
        {
            when: response =>
                (applicationType === 'gateway' || applicationType === 'microservice') &&
                response.authenticationType === 'uaa' &&
                uaaBaseName === undefined,
            type: 'input',
            name: 'uaaBaseName',
            message: 'What is the folder path of your UAA application?',
            default: '../uaa',
            validate: input => {
                if (input) {
                    return true;
                }

                return `Could not find a valid JHipster UAA server in path "${input}"`;
            },
            filter: input => {
                const uaaAppData = this.getUaaAppData(input);
                if (uaaAppData && uaaAppData.baseName && uaaAppData.applicationType === 'uaa') {
                    return uaaAppData.baseName;
                }

                // we only pass a name if we could read it
                return null;
            },
        },
        {
            type: 'list',
            name: 'databaseType',
            message: `Which ${chalk.yellow('*type*')} of database would you like to use?`,
            choices: answers => {
                const opts = [];
                if (!answers.reactive) {
                    opts.push({
                        value: 'sql',
                        name: 'SQL (H2, PostgreSQL, MySQL, MariaDB, Oracle, MSSQL)',
                    });
                } else {
                    opts.push({
                        value: 'sql',
                        name: 'SQL (H2, PostgreSQL, MySQL, MariaDB, MSSQL)',
                    });
                }
                opts.push({
                    value: 'mongodb',
                    name: 'MongoDB',
                });
                if (answers.authenticationType !== 'oauth2') {
                    opts.push({
                        value: 'cassandra',
                        name: 'Cassandra',
                    });
                }
                opts.push({
                    value: 'couchbase',
                    name: '[BROKEN] Couchbase',
                });
                opts.push({
                    value: 'neo4j',
                    name: '[BETA] Neo4j',
                });
                if (applicationType !== 'uaa') {
                    opts.push({
                        value: 'no',
                        name: 'No database',
                    });
                }
                return opts;
            },
            default: serverDefaultConfig.databaseType,
        },
        {
            when: response => response.databaseType === 'sql',
            type: 'list',
            name: 'prodDatabaseType',
            message: `Which ${chalk.yellow('*production*')} database would you like to use?`,
            choices: answers => (answers.reactive ? constants.R2DBC_DB_OPTIONS : constants.SQL_DB_OPTIONS),
            default: serverDefaultConfig.prodDatabaseType,
        },
        {
            when: response => response.databaseType === 'sql',
            type: 'list',
            name: 'devDatabaseType',
            message: `Which ${chalk.yellow('*development*')} database would you like to use?`,
            choices: response =>
                [
                    {
                        value: 'h2Disk',
                        name: 'H2 with disk-based persistence',
                    },
                    {
                        value: 'h2Memory',
                        name: 'H2 with in-memory persistence',
                    },
                ].concat(constants.SQL_DB_OPTIONS.find(it => it.value === response.prodDatabaseType)),
            default: serverDefaultConfig.devDatabaseType,
        },
        {
            when: answers => !answers.reactive,
            type: 'list',
            name: 'cacheProvider',
            message: 'Which cache do you want to use? (Spring cache abstraction)',
            choices: [
                {
                    value: 'ehcache',
                    name: 'Ehcache (local cache, for a single node)',
                },
                {
                    value: 'caffeine',
                    name: 'Caffeine (local cache, for a single node)',
                },
                {
                    value: 'hazelcast',
                    name: 'Hazelcast (distributed cache, for multiple nodes, supports rate-limiting for gateway applications)',
                },
                {
                    value: 'infinispan',
                    name: '[BETA] Infinispan (hybrid cache, for multiple nodes)',
                },
                {
                    value: 'memcached',
                    name: 'Memcached (distributed cache) - Warning, when using an SQL database, this will disable the Hibernate 2nd level cache!',
                },
                {
                    value: 'redis',
                    name: 'Redis (distributed cache)',
                },
                {
                    value: 'no',
                    name: 'No cache - Warning, when using an SQL database, this will disable the Hibernate 2nd level cache!',
                },
            ],
            default: applicationType === 'microservice' || applicationType === 'uaa' ? 2 : serverDefaultConfig.cacheProvider,
        },
        {
            when: answers =>
                ((answers.cacheProvider !== 'no' && answers.cacheProvider !== 'memcached') || applicationType === 'gateway') &&
                answers.databaseType === 'sql' &&
                !answers.reactive,
            type: 'confirm',
            name: 'enableHibernateCache',
            message: 'Do you want to use Hibernate 2nd level cache?',
            default: serverDefaultConfig.enableHibernateCache,
        },
        {
            type: 'list',
            name: 'buildTool',
            message: 'Would you like to use Maven or Gradle for building the backend?',
            choices: [
                {
                    value: 'maven',
                    name: 'Maven',
                },
                {
                    value: 'gradle',
                    name: 'Gradle',
                },
            ],
            default: serverDefaultConfig.buildTool,
        },
        {
            when: applicationType === 'monolith',
            type: 'list',
            name: 'serviceDiscoveryType',
            message: 'Do you want to use the JHipster Registry to configure, monitor and scale your application?',
            choices: [
                {
                    value: false,
                    name: 'No',
                },
                {
                    value: 'eureka',
                    name: 'Yes',
                },
            ],
            default: serverDefaultConfig.serviceDiscoveryType,
        },
    ];

    return this.prompt(prompts).then(answers => {
        this.serviceDiscoveryType = this.jhipsterConfig.serviceDiscoveryType = answers.serviceDiscoveryType;
        this.reactive = this.jhipsterConfig.reactive = answers.reactive;
        this.authenticationType = this.jhipsterConfig.authenticationType = answers.authenticationType;
        console.log('auth type is', this.authenticationType, this.jhipsterConfig.authenticationType, answers.authenticationType);

        this.packageName = this.jhipsterConfig.packageName = answers.packageName;
        this.serverPort = this.jhipsterConfig.serverPort = answers.serverPort || '8080';
        this.cacheProvider = this.jhipsterConfig.cacheProvider = !answers.reactive ? answers.cacheProvider : 'no';
        this.enableHibernateCache = this.jhipsterConfig.enableHibernateCache = !!answers.enableHibernateCache;
        this.databaseType = this.jhipsterConfig.databaseType = answers.databaseType;
        this.devDatabaseType = this.jhipsterConfig.devDatabaseType = answers.devDatabaseType;
        this.prodDatabaseType = this.jhipsterConfig.prodDatabaseType = answers.prodDatabaseType;
        this.searchEngine = this.jhipsterConfig.searchEngine = answers.searchEngine;
        this.buildTool = this.jhipsterConfig.buildTool = answers.buildTool;
        this.uaaBaseName = this.jhipsterConfig.uaaBaseName = answers.uaaBaseName || uaaBaseName;
    });
}
