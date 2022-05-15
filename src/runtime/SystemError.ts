/**
 * Use this exclusively for failures of the system due programming errors.
 */
export class SystemError extends Error {
    readonly name = 'SystemError';
    /**
     * Constructs a SystemError using the message. The stack will be logged to the console.
     */
    constructor(message?: string) {
        super(message);
        // eslint-disable-next-line no-console
        console.log(message, new Error().stack);
    }
}