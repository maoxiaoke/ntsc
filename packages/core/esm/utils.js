import { performance } from 'perf_hooks';
import picocolors from 'picocolors';
import fs from 'fs-extra';
export const timeFrom = (start, subtract = 0) => {
    const time = performance.now() - start - subtract;
    const timeString = (`${time.toFixed(2)} ms`).padEnd(5, ' ');
    if (time < 10) {
        return picocolors.green(timeString);
    }
    else if (time < 50) {
        return picocolors.yellow(timeString);
    }
    else {
        return picocolors.red(timeString);
    }
};
/**
 * check if path is dir
 * @param name
 * @returns Promise<Boolean>
 */
export const isDirectory = (name) => fs.existsSync(name) && fs.statSync(name).isDirectory();
export const isFile = (name) => fs.existsSync(name) && fs.statSync(name).isFile();
export const isObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
export function toArray(any) {
    return Array.isArray(any) ? any : [any];
}
