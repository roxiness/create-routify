import { createRequire } from 'module';
import { resolve } from 'path';
import k from 'kleur';
const require = createRequire(import.meta.url);

export function routifyIntro() {
    console.log();
    console.log(
        `  ${k.underline(
            `${k.bold().magenta('Routify')} ${k.bold('3')} beta`,
        )}`,
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
    console.log();
}
