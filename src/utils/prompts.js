import k from 'kleur';

export const onCancel = () => {
    console.log();
    console.log(
        `  ${k.bold().red('Exited')} ${k.magenta().dim('create-routify')}`,
    );

    process.exit(0);
};
