module.exports = {
    props: {
        usage: 'create',
        description: 'create a routify project from one of our templates',
        args: [
            {
                description: 'test',
                items: ['-t', '--test']
            }
        ]
    },

    run: () => {
        console.log('Not Implimented');
    }
};
