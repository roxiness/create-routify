import { rm } from 'fs/promises';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const resolveTestTemplate = (template) => {
    if (typeof template === 'string') return template;
    if (typeof template === 'object') {
        const { page, contains } = template;
        return `test('can see ${page}', async () => {
    await router.url.push('${page}')

    expect(document.body.innerHTML).toContain('${contains}')
})`;
    }
};

/**
 * @param {string} dir
 * @param {TestTemplate[]} tests
 */
export const createTestFiles = async (dir, tests) => {
    const testDir = join(dir, 'tests');
    await mkdirSync(testDir, { recursive: true });
    await writeFileSync(
        join(testDir, 'test.spec.js'),
        `/** @type { Router } */
let router

beforeAll(async () => {
    await import('../.routify/routify-init.js')
    router = globalThis.__routify.routers[0]
    await router.rendered()
})

${tests.map(resolveTestTemplate).join('\n\n')}
`,
    );
};

const installVitest = async (dir) => {
    // patch package.json
    const packageJsonPath = join(dir, 'package.json');
    const file = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(file);
    // if vitest isn't already installed, install it
    if (!packageJson.devDependencies.vitest) {
        packageJson.devDependencies.vitest = 'latest';
        // add script
        if (!packageJson.scripts.test) packageJson.scripts.test = 'vitest';
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
    // add test entry to vite.config.js
    const viteConfigPath = join(dir, 'vite.config.js');
    const viteConfig = readFileSync(viteConfigPath, 'utf-8');
    if (!viteConfig.includes('test:')) {
        writeFileSync(
            viteConfigPath,
            viteConfig.replace(
                'plugins: [',
                `
    test: {
        environment: 'jsdom',
        globals: true,
        server: {
            deps: { inline: ["@roxi/routify"] },
        }          
    },
    plugins: [`,
            ),
        );
    }
    // add global types to tsconfig.json
    if (existsSync(join(dir, 'tsconfig.json'))) {
        const tsConfigPath = join(dir, 'tsconfig.json');
        const tsConfigFile = readFileSync(tsConfigPath, 'utf-8');
        const tsConfig = JSON.parse(tsConfigFile);
        tsConfig.compilerOptions.types = [
            ...(tsConfig.compilerOptions.types || []),
            'vitest/globals',
        ];
        tsConfig.include = [...(tsConfig.include || []), 'tests/**/*'];
        writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    }
};

export const removeTests = async (dir) => {
    // remove tests folder (windows and unix)
    const testDir = join(dir, 'tests');
    await rm(testDir, { recursive: true, force: true });
    // remove any line from scripts and devDependencies that contains test
    const packageJsonPath = join(dir, 'package.json');
    const file = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(file);
    packageJson.scripts = Object.fromEntries(
        Object.entries(packageJson.scripts).filter(
            ([key]) => !key.includes('test'),
        ),
    );
    packageJson.devDependencies = Object.fromEntries(
        Object.entries(packageJson.devDependencies).filter(
            ([key]) => !key.includes('test'),
        ),
    );
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

/**
 *
 * @param {string} dir
 * @param {TemplateManifest['test']} test
 */
export const addTests = async (dir, test) =>
    Promise.all([createTestFiles(dir, test.tests), installVitest(dir)]);
