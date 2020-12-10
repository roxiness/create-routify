module.exports = ({ commands }) => {
    if (Array.isArray(commands)) {
        /* prettier-ignore */
        /* design inspiration from https://npmjs.org/commander */
        console.log([
            'Global Options:',
            '   -h, --help\t\t\tget help on a specific command',
            '',
            'Commands:',
            ...(commands.map(x => `   ${x.usage}${x.description ? `\t\t\t\t${x.description}` : ''}`)),
            ''
        ].join('\n'));
    } else {
    }
};
