import path from 'path';
import { toArray } from './utils.js';
import { transform } from './transform.js';

const DEFAULT_ENTRY_DIR = 'src';
const DEFAULT_OUPUT_DIR = 'esm';

export type Options = Partial<{
  dirs?: string[];
  outputDir?: string;
  root?: string;
}>

const build = (options: Options) => {
  const dirs = (options?.dirs && options.dirs?.length > 0) ?  toArray(options.dirs) : [DEFAULT_ENTRY_DIR];
  const root = options?.root ?? process.cwd();
  const outputDir = options?.root ?? path.join(root, DEFAULT_OUPUT_DIR);

  dirs.forEach(dir => {
    transform({
      entry: path.join(root, dir),
      outputDir,
    })
  })
}

export {
  build
}