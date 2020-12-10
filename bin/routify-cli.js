#!/usr/bin/env node
const pkg = require('../package.json');
const path = require('path');

const commands = require('../src/commands/commands.config.js');

const cmd = process.argv[process.argv.length - 1];
const action = commands.filter((x) => x.name == cmd)[0];

if (!action) {
    console.log('No valid command given, showing the help menu:\n');
    require('../src/commands/help.js')({ commands });
} else {
    require(path.join(__dirname, '../src/commands', action.path))({
        commands
    });
}

// Check for updates and notify if found
require('update-notifier')({ pkg }).notify();
