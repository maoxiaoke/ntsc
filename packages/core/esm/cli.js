#!/usr/bin/env node
import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { build } from './index.js';
const __dirname = dirname(fileURLToPath(import.meta.url));
const cli = cac('ntsc');
(async () => {
    cli
        .command('[...dirs]', 'Bundle files', {
        allowUnknownOptions: false,
        ignoreOptionDefaultValue: true, // only display options in help message.
    })
        .option('--entry <entry>', 'Entry directory')
        .option('--config <config>', 'Use custom config')
        .option('-d, --out-dir <dir>', "Output directory", {
        default: 'esm'
    })
        .option('--root-dir <rootDir>', 'Determine root directory', {
        default: 'pwd',
    })
        .option('--watch', 'Watch mode')
        .action(async (files, flags) => {
        consola.log('fsfsfds', files, flags);
        delete flags['--'];
        build({
            dirs: files,
            ...flags
        });
    });
    cli.help();
    const pkgPath = join(__dirname, '../package.json');
    cli.version(JSON.parse(readFileSync(pkgPath, 'utf-8')).version);
    cli.parse(process.argv, { run: true });
})()
    .catch((err) => {
    consola.error(err);
    process.exit(1);
});
