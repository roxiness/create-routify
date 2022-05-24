import logSymbols from 'log-symbols';
import simpleGit from 'simple-git';
import { rmSync } from 'fs';
import { join } from 'path';
import k from 'kleur';

export const run = async ({ projectDir, args }) => {
    const git = simpleGit(projectDir);

    console.log(k.blue(`\n${logSymbols.info} Cloning template...`));

    await git.clone('https://github.com/roxiness/routify-starter', projectDir);

    rmSync(join(projectDir, '.git'), {
        recursive: true,
        force: true,
    });
};
