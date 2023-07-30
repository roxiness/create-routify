import { getTemplate, onCancel } from '../../utils/prompts.js';
import { readdir, cp, rm } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import prompts from 'prompts';
import k from 'kleur';
import { getRoutifyExamplesDir, routifyIntro } from './utils.js';
import { existsSync } from 'fs';
import { addTests } from '../../utils/patcher/test/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const run = async (options) => {
    const { dir, force, version, starter } = options;
    console.log('options', options);
    routifyIntro();

    const routifyExamplesDir = getRoutifyExamplesDir();
    const project = await getTemplate(routifyExamplesDir, starter);
    console.log('project', project);
    if (project.test) {
        const { tests } = project.test;
        console.log(tests);
        addTests(projectDir, project.test);
    }

    // await cp(exampleDir, projectDir, { recursive: true });
    // await rm(join(projectDir, 'manifest.js'));
};
