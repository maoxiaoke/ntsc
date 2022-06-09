import type { SourceMapInput } from 'rollup';
import type { Options } from './index.js';
declare const transform: ({ entry, root, outputDir, }: Omit<Partial<{
    dirs?: string[];
    outputDir?: string;
    root?: string;
}>, "dirs"> & {
    entry: string;
}) => {
    filename: string;
    filePath?: string;
    absolutePath?: string;
    ext?: string;
    dest?: string;
    code?: string | Uint8Array;
    map?: string | SourceMapInput;
}[];
export { transform };
