import k from 'kleur';

function text() {
    console.log();
    console.log(
        k.red(`  ! R3 is under heavy work, expect bugs and missing features`),
    );

    console.log();
    console.log(
        `  ${k.underline(`${k.bold().magenta('Routify')} ${k.bold('3')}`)}`,
    );
    console.log(
        `  - Follow our twitter to get updates: ${k.blue(
            'https://twitter.com/routifyjs',
        )}`,
    );
    console.log(
        `  - Or join our discord: ${k.blue(
            'https://discord.com/invite/ntKJD5B',
        )}`,
    );
}

export const run = () => {
    text();
};
