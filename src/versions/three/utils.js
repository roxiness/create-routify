import { createRequire } from 'module';
import { resolve } from 'path';
const require = createRequire(import.meta.url);

/**
 * Returns the directory of @roxi/routify/examples
 */
export const getRoutifyExamplesDir = () => {
    const routifyPkgJsonPath = require.resolve('@roxi/routify/package.json');
    return resolve(routifyPkgJsonPath, '..', 'examples');
};
