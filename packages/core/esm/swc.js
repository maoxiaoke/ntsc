import deepmerge from 'deepmerge';
import * as swc from '@swc/core';
const normalizeSwcConfig = (mergeOptions) => {
    const commonOptions = {
        jsc: {
            target: "es2022",
            parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: true,
            },
            transform: {
                react: {
                    runtime: 'automatic',
                },
                legacyDecorator: true,
            },
            externalHelpers: true,
            loose: false, // No recommand
        },
        minify: false,
    };
    return deepmerge(commonOptions, mergeOptions);
};
const swcLoader = (_, id) => {
    const { code, map } = swc.transformSync(_, normalizeSwcConfig({
        minify: false,
        filename: id,
    }));
    return {
        code,
        map,
        meta: {
            ext: '.js'
        }
    };
};
export { swcLoader };
