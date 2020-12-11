/* design inspiration from https://npmjs.org/commander */
module.exports = ({ commands, command }) => {
    if (Array.isArray(commands) && !command) {
        /* prettier-ignore */
        console.log([
            'Global Options:',
            '   -h, --help',
            '',
            'Commands:',
            ...(commands.map(x => `   ${x.usage}`)),
            ''
        ].join('\n'));
    } else {
        /* prettier-ignore */
        console.log([
            `Usage: routify-cli ${command.usage}`,
            '',
            'Options:',
            '   -h, --help',
            ...(command.options ? command.options.map(x => `   ${x.usage}`) : [])
        ].join('\n'));
    }
};
