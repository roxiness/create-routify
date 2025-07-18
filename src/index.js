/**
 * @typedef {Object} Options
 * @property {string} dir
 * @property {string} projectDir
 * @property {string} version
 * @property {string} starterTemplate
 * @property {Template} template
 * @property {boolean} force
 * @property {boolean} headless
 * @property {boolean} debug
 * @property {''|'npm'|'yarn'|'pnpm'} packageManager
 * @property {string[]} features
 *
 *
 */

import { mkdir, cp, rm } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { join, relative, resolve } from 'path';
import symbols from 'log-symbols';
import color from 'picocolors';
import * as p from '@clack/prompts';
import { emitter, writePrettierConfig } from './utils/index.js';
import { addTests, removeTests } from './utils/patcher/test/index.js';
import { getTemplatesFromRepos } from './utils/repos.js';

const prompts = {
    version: () =>
        p.select({
            message: 'Routify Version:',
            options: [
                { label: 'Routify 2', value: 2 },
                {
                    label: `Routify 3`,
                    value: 3,
                    hint: 'This is a beta version',
                },
            ],
            initialValue: 3,
        }),
    dir: () =>
        p.text({
            message: 'Directory name:',
            initialValue: '',
            // hint: 'Leave empty to use current directory',
            defaultValue: '.',
            placeholder: 'Leave empty to use current directory',
        }),
    overwrite: () =>
        p.confirm({
            message: 'Directory is not empty, continue?',
            initialValue: false,
        }),
    selectFeatures: (availableFeatures) =>
        p.multiselect({
            message: 'Select features:',
            options: availableFeatures,
            initialValues: availableFeatures
                .filter((f) => f.initial)
                .map((f) => f.value),
        }),
    selectTemplate: (templates) =>
        p.select({
            message: 'Select template:',
            options: templates.map((template) => ({
                label: template.manifest?.name || template.name,
                value: template.name,
                hint: template.manifest?.description || template.description,
            })),
            initialValue: 'starter-basic',
        }),
    selectPackageManager: () =>
        p.select({
            message: 'Install dependencies with:',
            options: [
                { label: "Don't install", value: '' },
                { label: 'npm', value: 'npm' },
                { label: 'pnpm', value: 'pnpm' },
                { label: 'yarn', value: 'yarn' },
            ],
            initialValue: '',
        }),
    nextSteps: (dir, packageManager) => {
        const steps = [
            dir === '.' ? '' : `cd ${dir}`,
            packageManager ? '' : 'npm install',
            `${packageManager || 'npm'} run dev`,
        ]
            .filter(Boolean)
            .map((step, i) => `${i + 1}. ${step}`)
            .join('\n');

        return `Next steps: \n${steps}`;
    },
};

const check = {
    existingDir: async (options) => {
        const proceed =
            !existsSync(options.projectDir) ||
            !readdirSync(options.projectDir).length ||
            options.force ||
            (await prompts.overwrite());

        if (!proceed) {
            p.cancel('Directory not empty');
            process.exit();
        }
    },
    version: (version) => {
        if ([2, 3].includes(version.toString())) {
            p.cancel(`Version ${version} not found`);
            process.exit();
        }
    },
};

const getAvailableFeatures = (template) => {
    const features = template.manifest.features || [];
    if (template.manifest.test)
        features.push({
            label: 'test',
            value: 'test',
            hint: 'Add test files',
            initial: true,
        });
    features.push({
        label: 'prettier',
        value: 'prettier',
        hint: 'Add prettier config',
        initial: true,
    });
    return features;
};

/**
 *
 * @param {} options
 * @param {TemplateConfig} configs
 */
async function runPrompts(options, configs) {
    console.clear();
    p.intro(`${color.bgMagenta(color.black(' Routify CLI '))}`);

    options.version = options.version || (await prompts.version());
    check.version(options.version);
    const config = configs.versions[options.version];
    await setTemplates(configs, options);
    options.dir = options.dir || (await prompts.dir());

    options.projectDir = resolve(options.dir);
    await check.existingDir(options);

    while (!options.starterTemplate) {
        const refreshOption = {
            name: '[Refresh templates]',
            hint: 'Update templates from remote',
        };
        const customTemplates = {
            name: '[Include custom templates]',
            hint: 'Include templates from 3rd party repos',
        };
        const templates = [...options.templates];
        if (!options.forceRefresh) templates.push(refreshOption);
        if (
            !options.customTemplates &&
            config.templatesRepos.find((repo) => !repo.includeByDefault)
        )
            templates.push(customTemplates);
        options.starterTemplate =
            options.starterTemplate ||
            (await prompts.selectTemplate(templates));

        if (options.starterTemplate === '[Refresh templates]') {
            options.forceRefresh = true;
            await setTemplates(configs, options);
            options.starterTemplate = null;
        }
        if (options.starterTemplate === '[Include custom templates]') {
            options.customTemplates = true;
            await setTemplates(configs, options);
            options.starterTemplate = null;
        }
    }

    options.template = options.templates.find(
        (t) => t.manifest.name === options.starterTemplate,
    );

    if (!options.template)
        p.cancel(`Template ${options.starterTemplate} not found`);

    options.features =
        options.features ||
        (await prompts.selectFeatures(getAvailableFeatures(options.template)));

    options.packageManager =
        options.packageManager || (await prompts.selectPackageManager());
}

const copy = async (options) => {
    const s = p.spinner();
    s.start('Copying template to project directory');
    await mkdir(options.projectDir, { recursive: true });

    await cp(options.template.dir, options.projectDir, {
        recursive: true,
    });
    s.stop('Copied template to project directory');
};

const install = async (options) => {
    if (options.packageManager) {
        const s = p.spinner();

        const { exec } = await import('child_process');
        const { packageManager } = options;
        const cwd = relative(process.cwd(), options.projectDir);
        const cmd = `${packageManager} install`;
        s.start(`Installing via ${packageManager}`);
        await new Promise((resolve, reject) => {
            exec(cmd, { cwd }, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stdout);
                }
            });
        });

        s.stop('Installed via ' + packageManager);
    }
};

/**
 *
 * @param {Options} options
 */
export const manageTests = async (options) => {
    const { test } = options.template.manifest;
    const dir = options.projectDir;
    const shouldAddTest = options.features.includes('test');
    if (shouldAddTest) {
        await addTests(dir, test);
    } else await removeTests(dir);
};

/**
 * @param {Options} options
 */
const handleFeatures = async (options) => {
    const s = p.spinner();
    s.start('Set up features');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await manageTests(options);
    if (options.features.includes('prettier')) {
        writePrettierConfig(options.projectDir);
    }
    s.stop('Set up features');
};

/**
 *
 * @param {*} options
 * @param {TemplateConfig} configs
 */
const normalizeOptions = async (options, configs) => {
    options.version = options.version || 3;
    const config = configs.versions[options.version];
    await setTemplates(configs, options);
    options.projectDir = resolve(options.dir);
    options.starterTemplate = options.starterTemplate || config.defaultTemplate;
    options.template = options.templates.find(
        (t) => t.name === options.starterTemplate,
    );
    options.features = options.features || [];
    check.version(options.version);
    if (!options.template)
        p.cancel(`Template ${options.starterTemplate} not found`);
};

const normalizeManifest = (manifest) => ({
    features: [],
    preInstall: () => null,
    postInstall: () => null,
    exclude: [
        'node_modules',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock',
        'dist',
        '.pnpmfile.cjs',
        'manifest.js',
        '.routify',
    ],
    test: { tests: [] },
    ...manifest,
});

/**
 *
 * @param {TemplateConfig} configs
 * @param {*} options
 */
const setTemplates = async (configs, options) => {
    const config = configs.versions[options.version];
    options.templates = await getTemplatesFromRepos(
        config.templatesRepos,
        options.forceRefresh,
        options.debug,
    );
};

const removeExcludedFiles = async (options) => {
    const exclude = options.template.manifest.exclude.map((file) =>
        join(options.projectDir, file),
    );
    await Promise.all(
        exclude.map(async (file) => {
            if (existsSync(file)) {
                await rm(file, { recursive: true, force: true });
            }
        }),
    );
};

export const run = async (options) => {
    const s = p.spinner();
    emitter.on('download', (url) => s.start(`Downloading ${url}`));
    emitter.on('downloaded', ({ url, path }) =>
        s.stop(`Downloaded ${url} -> ${path}`),
    );
    const configs = (await import('../config.js')).default;

    const tools = { prompts: p };
    // console.log(options);
    // process.exit();
    if (!options.headless) await runPrompts(options, configs);
    else await normalizeOptions(options, configs);

    options.template.manifest = normalizeManifest(options.template.manifest);

    await copy(options);
    await handleFeatures(options);
    const { preInstall, postInstall } = options.template.manifest;
    await preInstall(options, tools);
    await removeExcludedFiles(options);
    await install(options);
    await postInstall(options, tools);

    p.note(
        prompts.nextSteps(options.dir, options.packageManager) +
            `\n\n${
                symbols.success
            } Need help? Join us on discord: ${color.underline(
                color.bgMagenta('https://discord.com/invite/ntKJD5B'),
            )}\n${
                symbols.success
            } Follow our twitter to get updates: ${color.underline(
                color.bgMagenta('https://twitter.com/routifyjs'),
            )}`,
    );
    p.outro('Happy coding!');
};
