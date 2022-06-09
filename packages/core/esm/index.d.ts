export declare type Options = Partial<{
    dirs?: string[];
    outputDir?: string;
    root?: string;
}>;
declare const build: (options: Options) => void;
export { build };
