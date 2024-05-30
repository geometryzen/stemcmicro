import { Atom, is_atom, U } from "@stemcmicro/tree";
import { is_str } from "../str/Str";

/**
 * An Err is synonymous with undefined.
 * undefined means that the types are correct but the expression is not meaningful because of the values.
 * An error that may be used as a return value. This MUST not be thrown.
 * Err may be considered to be synonymous with undefined.
 */
export class Err extends Error implements Atom {
    readonly type = "error";
    #message: U;
    #cause: Err | undefined;
    #pos: number | undefined;
    #end: number | undefined;
    #refCount = 1;
    constructor(message: U, cause?: Err, pos?: number, end?: number) {
        super(best_effort_message(message), cause);
        this.name = "Err";
        this.#message = message;
        this.#message.addRef();
        this.#cause = cause;
        if (cause) {
            cause.addRef();
        }
        this.#pos = pos;
        this.#end = end;
    }
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    get originalMessage(): U {
        this.#message.addRef();
        return this.#message;
    }
    get originalCause(): Err | undefined {
        if (this.#cause) {
            this.#cause.addRef();
            return this.#cause;
        } else {
            return void 0;
        }
    }
    get pos(): number | undefined {
        return this.#pos;
    }
    get end(): number | undefined {
        return this.#end;
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#message.release();
            if (this.#cause) {
                this.#cause.release();
            }
        }
    }
    get iscons(): false {
        return false;
    }
    get isnil(): false {
        return false;
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Err) {
            return this.equalsErr(other);
        } else {
            return false;
        }
    }
    equalsErr(other: Err): boolean {
        return this.#message.equals(other.#message);
    }
    override toString(): string {
        return `Err(${this.#message.toString()})`;
    }
    toInfixString(): string {
        throw new Error();
    }
    toListString(): string {
        throw new Error();
    }
}

export function is_err(expr: unknown): expr is Err {
    return expr instanceof Err;
}

export function assert_err(expr: U, context?: string, argName?: string): Err {
    if (is_err(expr)) {
        return expr;
    } else {
        if (typeof context === "string") {
            // TODO: This should be a reusable message for consistency.
            throw new Error(`${context}: Expecting ${argName} to be a Err but got ${expr}.`);
        } else {
            throw new Error("Expecting Err");
        }
    }
}

export function create_err(message: U, cause?: Err, pos?: number, end?: number): Err {
    return new Err(message, cause, pos, end);
}

/**
 * @returns a string representation of the message parameter.
 */
function best_effort_message(message: U): string {
    if (is_atom(message)) {
        if (is_str(message)) {
            return message.str;
        } else {
            return "";
        }
    } else {
        return "";
    }
}
