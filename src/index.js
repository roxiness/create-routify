import prompts from 'prompts';
import k from 'kleur';

const versions = {
    2: () => import('./versions/two.js'),
    3: () => import('./versions/three.js'),
};

/** @param {import('dashargs').DashArgs} args */
export const run = async (args) => {
    console.clear(); // ! REMOVE ME
    console.log(
        k.underline().bold(`Welcome to the ${k.magenta('Routify CLI')}!\n`),
    );

    if (args.has('version') && versions[args.get('version')])
        return runVersion(args.get('version'), args);

    const { version } = await prompts({
        type: 'select',
        name: 'version',
        message: 'Please Select the version of Routify you want to use:',
        choices: [
            { title: 'Routify 2', value: 2 },
            {
                title: `Routify 3 ${k.bold().magenta('[BETA]')}`,
                value: 3,
            },
        ],
    });

    console.log();

    runVersion(version, args);
};

const runVersion = async (version, args) => {
    const { run } = await versions[version]();
    run(args);
};
