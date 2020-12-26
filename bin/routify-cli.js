#!/usr/bin/env node
const pkg = require('../package.json');
const dash = require('dashargs');
const { join: joinPath } = require('path');

const args = dash.argv();
const input = dash.strip(process.argv.slice(2).join(' '));

const command = input.split(' ')[0];

try {
    const { props, run } = require(joinPath('../src/commands', command));

    if (args.has('help', 'h'))
        return require('../src/commands/help.js')({
            command,
            props
        });

    run({ args, input });
} catch {
    console.log('Error: Unable to find that subcommand');
}

// Check for updates and notify if found
require('update-notifier')({ pkg }).notify();
