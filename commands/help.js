const { readdirSync } = require('fs');
const { join: joinPath } = require('path');

module.exports = {
    props: {
        usage: 'help',
        description: 'get a list of routify-cli commands',
        args: []
    },

    run: ({ command, props, args }) => {
        try {
            if (command) {
                log(
                    `Command: ${command}\n`,
                    `<> Required | [] Optional`,
                    `Usage: routify-cli ${props.usage}\n`,
                    `Args/Flags:`,
                    ...af(props.args)
                );
            } else {
                const commands = readdirSync(__dirname).map((x) => ({
                    name: x.slice(0, -3),
                    props: require(joinPath(__dirname, x)).props
                }));

                log(
                    `All commands:\n`,
                    ...commands.map(
                        ({ name, props: { description } }) =>
                            `${name}\t- ${description}`
                    )
                );
            }
        } catch (e) {
            if (args.debug) console.error(e);
            console.log('There was a error displaying the help menu.');
        }
    }
};

function log(...i) {
    console.log(i.join('\n'));
}

function af(a) {
    return [
        ...a.map(
            ({ description, items }) => `${items.join(', ')}\t${description}`
        ),

        '-h, --help\tGet the help menu for a subcommand'
    ];
}
