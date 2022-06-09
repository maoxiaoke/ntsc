import fs from 'fs-extra';
import { globbySync} from 'globby';
import { toArray } from './utils.js';

export const INCLUDES_UTF8_FILE_TYPE = /\.(js|mjs|mts|ts|jsx|tsx|css|sass|less|json|html)$/;
/**
 * load entry files
 * @param entry
 * @returns
 */
export function loadEntryFiles(entry: string, excludes?: string | string[]) {
  return globbySync('**/*.*', {
    cwd: entry,
    ignore: ['node_modules/**', '*.d.ts', ...toArray(excludes ?? [])],
    onlyFiles: true,
  });
}

export function loadSource(path: string): string {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}
