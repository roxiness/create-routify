import { readdir } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync, rmSync } from 'fs';
import { createRequire } from 'module';
import download from 'download-git-repo';
import { emitter } from './index.js';
export const createDirname = (meta) => dirname(fileURLToPath(meta.url));
const __dirname = createDirname(import.meta);

const require = createRequire(import.meta.url);

const getReposPath = () => join(__dirname, '..', '..', '.repos');

const ensureRepo = async (url, force, onDownload) => {
    // convert url to file safe name
    const name = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const repoPath = `${getReposPath()}/${name}`;

    const localPath = url.match(/^local:(.*)/);
    if (localPath) return join(__dirname, '..', '..', localPath[1]);

    // if repo doesn't exist, download it
    if (!existsSync(repoPath) || force) {
        rmSync(repoPath, { recursive: true, force: true });
        emitter.emit('download', url);
        if (onDownload) onDownload();
        await new Promise((resolve, reject) =>
            download(url, repoPath, { clone: false }, (err) => {
                if (err) reject(err);
                else resolve(null);
            }),
        );
        emitter.emit('downloaded', url);
    }

    // return path to repo
    return repoPath;
};

export const getTemplatesDir = async (url, dir) => {
    const repoPath = await ensureRepo(url);

    return [repoPath, dir].filter(Boolean).join('/');
};

export class Manifest {
    /**
     * @param {Partial<TemplateManifest>} manifest
     */
    constructor(manifest) {
        this.name = manifest.name || '';
        this.description = manifest.description || '';
        this.test = manifest.test || null;
        this.features = manifest.features || [];
        this.postInstall = manifest.postInstall || (() => {});
        this.preInstall = manifest.preInstall || (() => {});
        this.error = manifest.error || null;
    }
}

export const getManifestFromDir = async (dir) => {
    try {
        return await import(
            pathToFileURL(join(dir, 'manifest.js')).pathname
        ).then((m) => new Manifest(m.default));
    } catch (error) {
        return new Manifest({ error });
    }
};

/**
 *
 * @param {TemplateRepoConfig[]} repos
 * @param {boolean} forceRefresh
 * @param {boolean} debug
 */
export const getTemplatesFromRepos = async (repos, forceRefresh, debug) => {
    /** @type {Template[]} */
    const templates = [];
    for (const repo of repos) {
        const repoPath = await ensureRepo(repo.url, forceRefresh);
        if (repo.templateType === 'single') {
            templates.push({
                dir: repoPath,
                name: repo.name,
                description: repo.description,
                manifest: await getManifestFromDir(repoPath),
            });
        } else if (repo.templateType === 'directory') {
            const templatePath = [repoPath, repo.path]
                .filter(Boolean)
                .join('/');
            const collectionTemplates = await getTemplatesFromDir(
                templatePath,
                debug,
            );
            templates.push(...collectionTemplates);
        }
    }
    return templates;
};

/**
 * Returns the directory of @roxi/routify/examples
 */
export const getRoutifyExamplesDir = () => {
    const routifyPkgJsonPath = require.resolve('@roxi/routify/package.json');
    return resolve(routifyPkgJsonPath, '..', 'examples');
};

/**
 * Returns every template with a manifest.js file
 * @param {string} routifyExamplesDir
 * @param {boolean=} debug
 * @returns {Promise<Template[]>}
 */
export const getTemplatesFromDir = async (routifyExamplesDir, debug) => {
    let dirNames = await readdir(routifyExamplesDir);
    return Promise.all(
        dirNames
            .map((name) => ({ name, dir: join(routifyExamplesDir, name) }))
            .filter(({ dir }) => existsSync(join(dir, 'manifest.js')))
            .map(async ({ dir, name }) => {
                return {
                    dir,
                    name,
                    manifest: await getManifestFromDir(dir),
                };
            }),
    );
};
