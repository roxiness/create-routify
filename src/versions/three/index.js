import { onCancel } from '../../utils/prompts.js';
import { readdir, cp, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import prompts from 'prompts';
import k from 'kleur';
import { getRoutifyExamplesDir } from './utils.js';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function text() {
    console.log();
    console.log(
        k.red(`  ! R3 is under heavy work, expect bugs and missing features`),
    );

    console.log();
    console.log(
        `  ${k.underline(`${k.bold().magenta('Routify')} ${k.bold('3')}`)}`,
    );
    console.log(
        `  - Follow our twitter to get updates: ${k.blue(
            'https://twitter.com/routifyjs',
        )}`,
    );
    console.log(
        `  - Or join our discord: ${k.blue(
            'https://discord.com/invite/ntKJD5B',
        )}`,
    );
    console.log();
}

async function getExampleDir() {
    const routifyExamplesDir = getRoutifyExamplesDir();
    let dirNames = await readdir(routifyExamplesDir);
    const projects = await Promise.all(
        dirNames
            .map((name) => join(routifyExamplesDir, name))
            .filter((dir) => existsSync(join(dir, 'manifest.js')))
            .map((dir) =>
                import(pathToFileURL(join(dir, 'manifest.js')).pathname).then(
                    (m) => ({ dir, manifest: m.default }),
                ),
            ),
    );

    const { project } = await prompts(
        {
            message: 'Please select a starter template',
            name: 'project',
            type: 'select',
            choices: projects.map((value) => ({
                title: value.manifest.name,
                description: value.manifest.description,
                value,
            })),
        },
        { onCancel },
    );

    return project.dir;
}

export const run = async ({ projectDir }) => {
    text();

    const exampleDir = await getExampleDir();

    await cp(exampleDir, projectDir, { recursive: true });
    await rm(join(projectDir, 'manifest.js'));
};
