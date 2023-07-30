# Create Routify

Welcome to the new Routiy CLI! This CLI currently supports both version 2 & 3 (beta) of Routify.

# Get Started

```sh
npm init routify@latest
```

# CLI Options

We have designed the cli to be able to be run in headless mode, as such the following options are available:

> Don't worry, most users won't need these as everyting is fully graphical first!

```
npm init routify [directory-name]

  -v, --version <version>                  use this to set the version of routify, e.g. 3
  -t, --starter-template <starterTemplate>    use this to set the starter template, e.g. starter-basic
  -f, --force                              this option bypasses directory checks, be careful as might overwrite files!
  -r, --force-refresh                      this option forces a refresh of the repos
  -f, --features <features>                optionally add features to your project, eg. "test", "prettier"
  -s, --skip                               this option skips all prompts
  -p, --package-manager <package-manager>  this option sets the package manager to use, e.g. "npm", "pnpm" or "yarn"
  -i, --install                            install dependencies after creating project
  -d, --debug                              run in debug mode
  -h, --help                               display help for command
```

### Contributors
See [CONTRIBUTORS.md](CONTRIBUTORS.md)