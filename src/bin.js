#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import { readFile } from 'fs/promises';
import { run } from '../src/index.js';
import { argv } from 'dashargs';

run(argv());

try {
    const pkg = await readFile('../package.json', 'utf-8');
    updateNotifier({ pkg: JSON.parse(pkg) }).notify();
} catch {}