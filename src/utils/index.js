import { writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import EventEmitter from 'events';
export const createDirname = (meta) => dirname(fileURLToPath(meta.url));

export const writePrettierConfig = async (dir) => {
    const prettierConfigPath = join(dir, '.prettierrc');
    if (!existsSync(prettierConfigPath)) {
        await writeFile(
            prettierConfigPath,
            `{
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 120
}`,
        );
    }
};

export const emitter = new EventEmitter();
