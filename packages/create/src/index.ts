#!/usr/bin/env node

import { fileURLToPath } from 'url';
import consola from 'consola';
import { cac } from 'cac';
import fs from 'fs-extra';
import path, { join } from 'path';
import inquirer from 'inquirer';
import { checkEmpty } from './checkEmpty.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cli = cac('@nzha/create-ntsc');

(async () => {
  cli.command('[...args]', 'Target dirname to generate', {
    allowUnknownOptions: false,
    ignoreOptionDefaultValue: true,
  })
    .action(async (args) => {
      const targetDirname = args[0] ?? '.';

      const dirPath = path.join(process.cwd(), targetDirname);
      await create(dirPath, targetDirname);
    });

  cli.help();

  const pkgPath = path.join(__dirname, '../package.json');
  const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  consola.info('@nzha/create-ntsc version: ', version);

  cli.version(version);

  cli.parse(process.argv, { run: true });
})()
  .catch((err) => {
    consola.error(err);
    process.exit(1);
  });

async function create(dirPath: string, dirname: string): Promise<void> {
  await fs.ensureDir(dirPath);
  const empty = await checkEmpty(dirPath);

  if (!empty) {
    const { go } = await inquirer.prompt({
      type: 'confirm',
      name: 'go',
      message:
          'Files exist in the current directory already. Are you sure to continue ？',
      default: false,
    });
    if (!go) process.exit(1);
  }

  const { repoType }  = await inquirer.prompt({
    type: 'list',
    message: 'Please select repo type',
    name: 'repoType',
    default: 'singleton',
    choices: ['singleton', 'monorepo']
  });

  const templatePath = join(__dirname, `../templates/${repoType}`);

  fs.copy(templatePath, dirPath);

  console.log();
  console.log('Initialize repo successfully.');
  console.log();
  console.log(`    cd ${dirname}`);
  console.log('    pnpm install');
  console.log('    pnpm start');
  console.log();
}

