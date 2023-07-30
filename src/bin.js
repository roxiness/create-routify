#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import { readFile } from 'fs/promises';
import { run } from '../src/index.js';
import { program } from 'commander';

parseArgs();

try {
    const pkg = await readFile('../package.json', 'utf-8');
    updateNotifier({ pkg: JSON.parse(pkg) }).notify();
} catch {}

function parseArgs(config) {
    program
        .argument('[dir]', 'name of the directory to create')
        .option(
            '-v, --version <version>',
            'use this to set the version of routify, e.g. 3',
        )
        .option(
            '-t, --starter-template <starterTemplate>',
            'use this to set the starter template, e.g. starter-basic',
        )
        .option(
            '-f, --force',
            'this option bypasses directory checks, be careful as might overwrite files!',
        )
        .option(
            '-r, --force-refresh',
            'this option forces a refresh of the repos',
        )
        .option(
            '--features <features...>',
            'optionally add features to your project, eg. "test", "prettier"',
        )
        .option('-H, --headless', 'run in headless mode')
        .option(
            '-p, --package-manager <package-manager>',
            'this option sets the package manager to use, e.g. "npm", "pnpm" or "yarn"',
        )
        .option('-i, --install', 'install dependencies after creating project')
        .option('-d, --debug', 'run in debug mode')
        .action((dir, options) => {
            run({ dir, ...options });
        })
        .parse();
}
