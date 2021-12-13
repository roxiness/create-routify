import { onCancel } from './utils/prompts.js';
import { existsSync, readdirSync } from 'fs';
import { mkdir } from 'fs/promises';
import symbols from 'log-symbols';
import { relative } from 'path';
import { resolve } from 'path';
import prompts from 'prompts';
import k from 'kleur';

const versions = {
    2: () => import('./versions/two.js'),
    3: () => import('./versions/three/index.js'),
};

async function getVersion(args) {
    const argsVersion = args.v || args.version;
    if (argsVersion) return argsVersion;

    const { version } = await prompts(
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
        { onCancel },
    );

    return version;
}

export const run = async ({ args }) => {
    console.log(`  ${k.dim(`v${'1.0.0'}`)}`);
    console.log(`  ${k.bold().magenta('Routify')} ${k.magenta().dim('CLI')}`);
    console.log();

    const version = await getVersion(args);

    if (!Object.keys(versions).includes(version))
        return console.log(`  ${k.red(`Version ${version} not found`)}`);

    const projectName = args._[0] || '.';
    const projectDir = resolve(projectName.toString());

    if (existsSync(projectDir) && readdirSync(projectDir).length > 0) {
        const { proceed } = await prompts(
            {
                type: 'confirm',
                message: `Directory is not empty, continue?`,
                name: 'proceed',
            },
            { onCancel },
        );

        if (!proceed) return onCancel();
    }

    await mkdir(projectDir, { recursive: true });

    await runVersion(version, { args, projectDir });

    console.log();
    console.log(`  ${k.green('All Done!')}`);
    console.log();
    console.log(`  Now you can:`);

    let i = 1;

    console.log(`    ${i++}) cd ${relative(process.cwd(), projectDir)}`);
    console.log(`    ${i++}) npm install`);
    console.log(`    ${i++}) npm run dev`);

    console.log();

    console.log(
        `${symbols.success} If you need help, ${k.blue(
            'join the Discord',
        )}: https://discord.com/invite/ntKJD5B`,
    );
};

const runVersion = async (version, args) => {
    const { run } = await versions[version]();
    return run(args);
};
