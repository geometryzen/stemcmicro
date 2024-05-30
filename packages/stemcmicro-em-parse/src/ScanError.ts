export class ScanError extends Error {
    constructor(message: string, pos: number, end: number) {
        super(`${message} in range [${pos}, ${end}]`);
    }
}
