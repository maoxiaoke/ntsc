export declare const timeFrom: (start: number, subtract?: number) => string;
/**
 * check if path is dir
 * @param name
 * @returns Promise<Boolean>
 */
export declare const isDirectory: (name: string) => any;
export declare const isFile: (name: string) => any;
export declare const isObject: (value: unknown) => value is Record<string, any>;
export declare function toArray<T>(any: T | T[]): T[];
