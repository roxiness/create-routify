/**
 * @typedef {Object} TemplateConfig
 * @property {Object.<string, TemplateConfigEntry>} versions
 */

/**
 * @typedef {Object} TemplateConfigEntry
 * @property {TemplateRepoConfig[]} templatesRepos
 * @property {{label: string, value: string, hint?: string, initial?: boolean}[]} features
 */

/**
 * @typedef {Object} TemplateRepoConfig
 * @property {string} url
 * @property {string=} path
 * @property {string=} name
 * @property {string=} description
 * @property {'directory'|'single'} templateType
 * @property {string} author
 * @property {boolean} includeByDefault
 * @property {boolean=} requireManifest
 */

/**
 * @typedef {Object} Template
 * @property {string} dir
 * @property {string} name
 * @property {string=} description
 * @property {TemplateManifest} manifest
 *
 * @typedef {Object} TemplateManifest
 * @property {string} name
 * @property {string} description
 * @property {Object} test
 * @property {TestTemplate[]} test.tests
 * @property {{label: string, value: string, hint?: string, initial?: boolean}[]} features
 * @property {function} postInstall
 * @property {function} preInstall
 * @property {string[]} exclude - the files to exclude from the template
 * @property {any=} error
 *
 * @typedef {TestTemplateString | TestTemplateObject} TestTemplate
 *
 * @typedef {string} TestTemplateString
 *
 * @typedef {Object} TestTemplateObject
 * @property {string} page - the page to test
 * @property {string} contains - the string to look for in the page
 */
