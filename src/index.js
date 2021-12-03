import prompts from 'prompts';
import k from 'kleur';

export const run = () => {
    console.log(
        k.underline().bold(`Welcome to the ${k.magenta('Routify CLI')}!`),
    );

    console.log('Please select the version of routify you would like to use:');
};
