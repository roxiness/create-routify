# Contributors

## Adding your own template repo
To contribute new templates to the project, you need to create a configuration for it that matches our TemplateRepoConfig type. The configuration is added to `config.js`.

You can contribute two types of template repositories: `single` and `directory`. `single` contains one main template. `directory`, on the other hand, houses multiple templates, each in its own subdirectory.

Here are examples of TemplateRepoConfig objects for each type:

### Single template repo
```javascript
{
    "url": "github:user/repo",
    "path": "optional/path/inside/repo",
    "name": "My Custom Template",
    "description": "This is a custom template contributed to the project.",
    "templateType": "single",
    "author": "Your Name",
}
```

### Directory templates repo
```javascript
{
    "url": "github:user/repo",
    "path": "optional/path/inside/repo",
    "templateType": "directory",
    "author": "Your Name",
    "requireManifest": false // folders without a manifest will be skipped
}
```

## Template Manifest
Manifests are optional and located at `<template>/manifest.js`. They enhance the template with extra information and features.

Here's a Template manifest example
```javascript
{
    name: 'my starter template',
    description: 'description of my template',    
    test: {
        // adding tests will enable the `test` feature option
        // if users enable tests, this will automatically install vitest to the project
        tests: [{ page: '/', contains: 'Welcome to my starter template' }],
    },
    // features are selectable by the user after selecting the template
    features: [
        {
            label: 'My Super Feature',
            value: 'my-super-feature',
            hint: 'This adds a super feature to the projet',
            initial: true, // should the user opt in or opt out
        },
    ],    
    // runs after `npm install`, whether install is skipped or not
    // options contains the options selected by the user
    postInstall: async (options)=>{        
        // it's often easier to remove a feature than add a feature
        if (!options.features.includes('my-super-feature')) {
            const { rm } = await import('fs/promises');
            await rm(`${options.projectDir}/src/components/superFeature.js`);
        }
    }
    // same as postInstall, but runs before `npm install`
    // preInstall: (options)=>{}
}