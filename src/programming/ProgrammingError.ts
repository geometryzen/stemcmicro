export class ProgrammingError extends Error {
    constructor(message?: string) {
        super();
        this.name = "ProgrammingError";
        if (typeof message === 'string') {
            this.message = message;
        }
    }
}