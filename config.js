const features = {
    prettier: {
        label: 'prettier',
        value: 'prettier',
        hint: 'Add prettier config',
        initial: true,
    },
};

/** @type {TemplateConfig} */
export default {
    versions: {
        2: {
            defaultTemplate: 'v2 starter template',
            templatesRepos: [
                {
                    url: 'roxiness/routify-starter',
                    name: 'v2 starter template',
                    description: 'Routify v2 starter template',
                    templateType: 'single',
                    author: 'Roxi (official)',
                    includeByDefault: true,
                },
            ],
            features: [features.prettier],
        },
        3: {
            defaultTemplate: 'basic-starter',
            templatesRepos: [
                {
                    url: 'roxiness/routify#next',
                    // url: 'local:../routify',
                    path: 'examples',
                    templateType: 'directory',
                    author: 'Roxi (official)',
                    includeByDefault: true,
                    requireManifest: true,
                },
            ],
            features: [features.prettier],
        },
    },
};
