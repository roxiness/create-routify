#!/usr/bin/env node
import { readFile } from 'fs/promises';
import minimist from 'minimist';
import updateNotifier from 'update-notifier';
import { run } from '../src/index.js';

const args = minimist(process.argv.slice(2));

run({ args });

try {
    const pkg = await readFile('../package.json', 'utf-8');
    updateNotifier({ pkg: JSON.parse(pkg) }).notify();
} catch {}
