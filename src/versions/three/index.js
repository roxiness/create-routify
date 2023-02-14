import { cp, readdir } from 'fs/promises';
import k from 'kleur';
import { dirname, join } from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import { onCancel } from '../../utils/prompts.js';

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
    const projects = await readdir(join(__dirname, './examples'));

    const { project } = await prompts(
        {
            message: 'Please select a example project',
            name: 'project',
            type: 'select',
            choices: projects.map((value) => ({ title: value, value })),
        },
        { onCancel },
    );

    return `./examples/${project}`;
}

export const run = async ({ projectDir }) => {
    text();

    const { projectType } = await prompts(
        {
            type: 'select',
            name: 'projectType',
            message: 'What template would you like?',
            choices: [
                {
                    title: 'Skeleton Project',
                    value: 'skeleton',
                },
                {
                    title: 'Skeleton Project (TS)',
                    value: 'skeleton-ts',
                },
                {
                    title: 'Example Project',
                    value: 'example',
                },
            ],
        },
        { onCancel },
    );

    if (!['skeleton', 'example', 'skeleton-ts'].includes(projectType))
        return console.log(`  ${k.red('Unable to find type ' + projectType)}`);

    const map = {
        'skeleton-ts': './skeleton-ts',
        skeleton: './skeleton',
    };

    const exampleDir = join(
        __dirname,
        map[projectType] || (await getExampleDir()),
        '/',
    );

    await cp(exampleDir, projectDir, { recursive: true });
};
