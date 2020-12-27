#!/usr/bin/env node
const pkg = require('../package.json');
const dash = require('dashargs');
const { join: joinPath } = require('path');

const args = dash.argv();
const input = dash.strip(process.argv.slice(2).join(' '));

const command = input.split(' ')[0];

try {
    if (!command && args.has('help', 'h'))
        return require('../commands/help.js').run({ args });

    const { props, run } = require(joinPath('../commands', command + '.js'));

    if (args.has('help', 'h'))
        require('../commands/help.js').run({
            command,
            props,
            args
        });

    run({ args, input });
} catch (e) {
    if (args.debug) console.error(e);
    console.log('Error: Unable to find that subcommand');
}

// Check for updates and notify if found
require('update-notifier')({ pkg }).notify();
