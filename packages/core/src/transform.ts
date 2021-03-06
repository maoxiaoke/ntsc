import { performance } from 'perf_hooks';
import { resolve, extname, dirname, relative } from 'path';
import fs from 'fs-extra';
import { loadEntryFiles, loadSource, INCLUDES_UTF8_FILE_TYPE } from './load.js';
import { isObject, isDirectory, timeFrom } from './utils.js';
import { createLogger } from './logger.js';
import { swcLoader } from './swc.js';

import type { SourceMapInput } from 'rollup';
import type { Options } from './index.js';

interface OutputFile {
  // globby parsed path, which is relative
  filePath?: string;
  // Absolute path of source file
  absolutePath?: string;
  // ext: 'jsx' | 'js' | 'ts' | 'tsx' | 'mjs' | 'png' | 'scss' | 'less' | 'css' | 'png' | 'jpg';
  ext?: string;
  // Absolute path of output files
  dest?: string;
  // Filename of output file
  filename?: string;
  // Parsed code
  code?: string | Uint8Array;
  // Source map
  map?: string | SourceMapInput;
}

const transform = (
  {
    entry,
    root,
    outputDir,
  }: Omit<Options, 'dirs'> & { entry: string }
) => {
  const logger = createLogger('ntsc');
  const entryDir = entry;

  let files: OutputFile[];

  if (!isDirectory(entry)) {
    logger.error(`${entryDir} is expected to be a directory.`);
    return;
  }

  files =
    loadEntryFiles(
      resolve(root, entryDir),
    )
      .map((filePath) => ({
        filePath,
        absolutePath: resolve(root, entryDir, filePath),
        ext: extname(filePath),
      }));

  const transformStart = performance.now();

  logger.debug('Build start...');

  fs.removeSync(outputDir);

  for (let i = 0; i < files.length; ++i) {
    const traverseFileStart = performance.now();
    const dest = resolve(outputDir, files[i].filePath);
    files[i].dest = dest;

    fs.ensureDirSync(dirname(dest));

    let code: string = null;
    let map: SourceMapInput = null;

    if (!INCLUDES_UTF8_FILE_TYPE.test(files[i].ext)) {
      fs.copyFileSync(files[i].absolutePath, dest);

      logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
      logger.debug(`Copy File ${files[i].absolutePath} to ${dest}`);

      continue;
    }

    code = loadSource(files[i].absolutePath);

    const transformResult = swcLoader(code, files[i].filename)

    if (transformResult === null ||
        (isObject(transformResult) && transformResult.code === null)
    ) {
      // ????????? transfrom ?????????code ????????????
    } else {
      files[i].code = code = transformResult.code;
      files[i].map = map = transformResult.map;

      // @ts-ignore
      const finalExtname = transformResult?.meta?.ext;

      // If extname changed
      if (finalExtname) {
        files[i].dest = (files[i].dest).replace(files[i].ext, finalExtname);
      }
    }

    // If soucemaps
    if (map) {
      const standardizedMap = typeof map === 'string' ? map : JSON.stringify(map);

      fs.writeFileSync(
        files[i].dest,
        `${code}\n //# sourceMappingURL=${files[i].dest}.map`,
        'utf-8',
      );
      fs.writeFileSync(`${files[i].dest}.map`, standardizedMap, 'utf-8');
    } else {
      fs.writeFileSync(files[i].dest, code, 'utf-8');
    }

    logger.debug(`Transform file ${files[i].absolutePath}`, timeFrom(traverseFileStart));
  }

  logger.info(`?????? Build success in ${timeFrom(transformStart)}`);

  return files.map((file) => ({ ...file, filename: relative(outputDir, file.dest) }));
}

export {
  transform
}
