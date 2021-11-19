#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import { run } from '../src/index.js';
import pkg from '../package.json';

updateNotifier({ pkg }).notify();

run();
