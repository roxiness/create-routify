module.exports = ({ commands }) => {
    if (Array.isArray(commands)) {
        /* prettier-ignore */
        /* design inspiration from https://npmjs.org/commander */
        console.log([
            'Global Options:',
            '   -h, --help',
            '',
            'Commands:',
            ...(commands.map(x => `   ${x.usage}`)),
            ''
        ].join('\n'));
    } else {
    }
};
