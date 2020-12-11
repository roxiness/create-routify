#!/usr/bin/env node
const pkg = require('../package.json');
const dash = require('dashargs');
const path = require('path');

const commands = require('../src/commands/commands.config.js');
const args = dash.parse(process.argv.slice(2).join(' '));

const cmd = process.argv[process.argv.length - 1];
const action = commands.filter((x) => x.name == cmd)[0];

if (!action) {
    console.log('No valid command given, showing the help menu:\n');
    require('../src/commands/help.js')({ commands });
} else {
    if (args.help === true || args.h === true)
        return require('../src/commands/help.js')({ command: action });
    require(path.join(__dirname, '../src/commands', action.path))({
        commands,
        args
    });
}

// Check for updates and notify if found
require('update-notifier')({ pkg }).notify();
