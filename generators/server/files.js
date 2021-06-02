const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const DOCKER_DIR = constants.DOCKER_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

const shouldSkipUserManagement = generator =>
    generator.skipUserManagement && (generator.applicationType !== 'monolith' || generator.authenticationType !== 'oauth2');

const serverFiles = {
    serverJavaAuthConfig: [
        {
            condition: generator => !generator.reactive && generator.applicationType !== 'uaa',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/SecurityConfiguration_uaa.java',
                    renameTo: generator => `${generator.javaDir}config/SecurityConfiguration.java`,
                },
            ],
        },
        {
            condition: generator => !shouldSkipUserManagement(generator) && generator.applicationType === 'uaa',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/UaaWebSecurityConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/UaaWebSecurityConfiguration.java`,
                },
                {
                    file: 'package/config/UaaConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/UaaConfiguration.java`,
                },
                {
                    file: 'package/config/UaaProperties.java',
                    renameTo: generator => `${generator.javaDir}config/UaaProperties.java`,
                },
                {
                    file: 'package/security/IatTokenEnhancer.java',
                    renameTo: generator => `${generator.javaDir}security/IatTokenEnhancer.java`,
                },
            ],
        },
    ],
    serverJavaGateway: [
        {
            condition: generator => generator.applicationType === 'gateway' && generator.authenticationType === 'uaa',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                { file: 'package/web/rest/AuthResource.java', renameTo: generator => `${generator.javaDir}web/rest/AuthResource.java` },
                {
                    file: 'package/web/filter/RefreshTokenFilter.java',
                    renameTo: generator => `${generator.javaDir}web/filter/RefreshTokenFilter.java`,
                },
                {
                    file: 'package/web/filter/RefreshTokenFilterConfigurer.java',
                    renameTo: generator => `${generator.javaDir}web/filter/RefreshTokenFilterConfigurer.java`,
                },
                {
                    file: 'package/config/oauth2/OAuth2AuthenticationConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/oauth2/OAuth2AuthenticationConfiguration.java`,
                },
                {
                    file: 'package/security/oauth2/CookieCollection.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/CookieCollection.java`,
                },
                {
                    file: 'package/security/oauth2/CookiesHttpServletRequestWrapper.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/CookiesHttpServletRequestWrapper.java`,
                },
                {
                    file: 'package/security/oauth2/CookieTokenExtractor.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/CookieTokenExtractor.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2AuthenticationService.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/OAuth2AuthenticationService.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2CookieHelper.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/OAuth2CookieHelper.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2Cookies.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/OAuth2Cookies.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2TokenEndpointClient.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/OAuth2TokenEndpointClient.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2TokenEndpointClientAdapter.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/OAuth2TokenEndpointClientAdapter.java`,
                },
                {
                    file: 'package/security/oauth2/UaaTokenEndpointClient.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/UaaTokenEndpointClient.java`,
                },
            ],
        },
    ],
    serverMicroservice: [
        {
            condition: generator =>
                generator.authenticationType === 'uaa' &&
                (generator.applicationType === 'microservice' || generator.applicationType === 'gateway'),
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/oauth2/OAuth2Properties.java',
                    renameTo: generator => `${generator.javaDir}config/oauth2/OAuth2Properties.java`,
                },
                {
                    file: 'package/config/oauth2/OAuth2JwtAccessTokenConverter.java',
                    renameTo: generator => `${generator.javaDir}config/oauth2/OAuth2JwtAccessTokenConverter.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2SignatureVerifierClient.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/OAuth2SignatureVerifierClient.java`,
                },
                {
                    file: 'package/security/oauth2/UaaSignatureVerifierClient.java',
                    renameTo: generator => `${generator.javaDir}security/oauth2/UaaSignatureVerifierClient.java`,
                },
            ],
        },
        {
            condition: generator =>
                !generator.reactive && generator.applicationType === 'microservice' && generator.authenticationType === 'uaa',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/FeignConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/FeignConfiguration.java`,
                },
                {
                    file: 'package/client/AuthorizedFeignClient.java',
                    renameTo: generator => `${generator.javaDir}client/AuthorizedFeignClient.java`,
                },
                {
                    file: 'package/client/OAuth2InterceptedFeignConfiguration.java',
                    renameTo: generator => `${generator.javaDir}client/OAuth2InterceptedFeignConfiguration.java`,
                },
                {
                    file: 'package/client/AuthorizedUserFeignClient.java',
                    renameTo: generator => `${generator.javaDir}client/AuthorizedUserFeignClient.java`,
                },
                {
                    file: 'package/client/OAuth2_UserFeignClientInterceptor.java',
                    renameTo: generator => `${generator.javaDir}client/UserFeignClientInterceptor.java`,
                },
                {
                    file: 'package/client/OAuth2UserClientFeignConfiguration.java',
                    renameTo: generator => `${generator.javaDir}client/OAuth2UserClientFeignConfiguration.java`,
                },
            ],
        },
        {
            condition: generator =>
                (!generator.reactive && generator.applicationType === 'gateway' && !generator.serviceDiscoveryType) ||
                generator.authenticationType === 'uaa',
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/RestTemplateConfiguration.java',
                    renameTo: generator => `${generator.javaDir}config/RestTemplateConfiguration.java`,
                },
            ],
        },
        {
            condition: generator =>
                !(
                    generator.applicationType !== 'microservice' &&
                    !(
                        generator.applicationType === 'gateway' &&
                        (generator.authenticationType === 'uaa' || generator.authenticationType === 'oauth2')
                    )
                ) && generator.applicationType === 'microservice',
            path: SERVER_MAIN_RES_DIR,
            templates: [{ file: 'static/microservices_index.html', renameTo: () => 'static/index.html' }],
        },
    ],
    serverTestFw: [
        {
            condition: generator => generator.authenticationType === 'uaa',
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/config/OAuth2TestConfiguration.java',
                    renameTo: generator => `${generator.testDir}config/OAuth2TestConfiguration.java`,
                },
                {
                    file: 'package/security/OAuth2TokenMockUtil.java',
                    renameTo: generator => `${generator.testDir}security/OAuth2TokenMockUtil.java`,
                },
                {
                    file: 'package/config/SecurityBeanOverrideConfiguration.java',
                    renameTo: generator => `${generator.testDir}config/SecurityBeanOverrideConfiguration.java`,
                },
            ],
        },
        {
            condition: generator => generator.authenticationType === 'uaa' && generator.applicationType === 'gateway',
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/security/oauth2/OAuth2CookieHelperTest.java',
                    renameTo: generator => `${generator.testDir}security/oauth2/OAuth2CookieHelperTest.java`,
                },
                {
                    file: 'package/security/oauth2/OAuth2AuthenticationServiceTest.java',
                    renameTo: generator => `${generator.testDir}security/oauth2/OAuth2AuthenticationServiceTest.java`,
                },
                {
                    file: 'package/security/oauth2/CookieTokenExtractorTest.java',
                    renameTo: generator => `${generator.testDir}security/oauth2/CookieTokenExtractorTest.java`,
                },
                {
                    file: 'package/security/oauth2/CookieCollectionTest.java',
                    renameTo: generator => `${generator.testDir}security/oauth2/CookieCollectionTest.java`,
                },
            ],
        },
    ],
    serverJavaUserManagement: [
        {
            condition: generator =>
                generator.skipUserManagement &&
                generator.authenticationType !== 'uaa' &&
                ['monolith', 'gateway'].includes(generator.applicationType),
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/AccountResource.java',
                    renameTo: generator => `${generator.javaDir}web/rest/AccountResource.java`,
                },
            ],
        },
        {
            condition: generator =>
                generator.skipUserManagement &&
                generator.authenticationType !== 'uaa' &&
                ['monolith', 'gateway'].includes(generator.applicationType),
            path: SERVER_TEST_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/AccountResourceIT.java',
                    renameTo: generator => `${generator.testDir}web/rest/AccountResourceIT.java`,
                },
            ],
        },
    ],
};
function writeFiles() {
    return {
        writeFilesUaa() {
            return this.writeFilesToDisk(serverFiles);
        },
    };
}

module.exports = {
    writeFiles,
    serverFiles,
};
