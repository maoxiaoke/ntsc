import { performance } from 'perf_hooks';
import picocolors from 'picocolors';
import fs from 'fs-extra';

export const timeFrom = (start: number, subtract = 0): string => {
  const time: number | string = performance.now() - start - subtract;
  const timeString = (`${time.toFixed(2)} ms`).padEnd(5, ' ');
  if (time < 10) {
    return picocolors.green(timeString);
  } else if (time < 50) {
    return picocolors.yellow(timeString);
  } else {
    return picocolors.red(timeString);
  }
};

/**
 * check if path is dir
 * @param name
 * @returns Promise<Boolean>
 */
 export const isDirectory =
 (name: string) => fs.existsSync(name) && fs.statSync(name).isDirectory();

export const isFile = (name: string) => fs.existsSync(name) && fs.statSync(name).isFile();

export const isObject = (value: unknown): value is Record<string, any> => Object.prototype.toString.call(value) === '[object Object]';

export function toArray<T>(any: T | T[]): T[] {
  return Array.isArray(any) ? any : [any];
}