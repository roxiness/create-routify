import { onCancel } from './utils/prompts.js';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import prompts from 'prompts';
import k from 'kleur';

const versions = {
    2: () => import('./versions/two.js'),
    3: () => import('./versions/three.js'),
};

/** @param {import('dashargs').DashArgs} args */
export const run = async (args) => {
    console.clear(); // ! REMOVE ME

    console.log(`  ${k.dim(`v${'1.0.0'}`)}`);
    console.log(`  ${k.bold().magenta('Routify')} ${k.magenta().dim('CLI')}`);
    console.log();

    const { version, projectName } = await prompts(
        [
            // TODO disable this if version cli opt
            {
                type: 'select',
                name: 'version',
                message: 'Routify Version:',
                choices: [
                    { title: 'Routify 2', value: 2 },
                    {
                        title: `Routify 3 ${k.bold().magenta('[BETA]')}`,
                        value: 3,
                    },
                ],
            },
            // TODO disable this if file name given
            {
                type: 'text',
                name: 'projectName',
                message: 'Project Name:   ',
                initial: 'my-routify-app',
            },
        ],
        { onCancel },
    );

    const projectPath = resolve(projectName);

    // TODO if dir exists and isn't empty check if it's ok to continue
    await mkdir(projectPath, { recursive: true });

    runVersion(version, args);
};

const runVersion = async (version, args) => {
    const { run } = await versions[version]();
    run(args);
};
