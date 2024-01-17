export class TokenError extends Error {
    constructor(message: string, pos: number, end: number) {
        super(`${message} in range [${pos}, ${end}]`);
    }
}
