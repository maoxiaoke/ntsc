/**
 * create logger
 * @param name
 * @returns
 */
export declare function createLogger(namespace?: string): {
    info(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    debug(...args: any[]): void;
};
export declare type CreateLoggerReturns = ReturnType<typeof createLogger>;
