import { Atom } from "../atom/Atom";
import { U } from "../tree";
import { TYPEOF_ERR } from "./TYPEOF_ERR";

/**
 * An Err is synonymous with undefined.
 * undefined means that the types are correct but the expression is not meaningful because of the values. 
 * An error that may be used as a return value. This MUST not be thrown.
 * Err may be considered to be synonymous with undefined.
 */
export class Err extends Atom {
    #cause: U;
    constructor(cause: U, pos?: number, end?: number) {
        super(TYPEOF_ERR, pos, end);
        this.#cause = cause;
    }
    get cause(): U {
        return this.#cause;
    }
    override equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Err) {
            return this.equalsErr(other);
        }
        else {
            return false;
        }
    }
    equalsErr(other: Err): boolean {
        return this.cause.equals(other.cause);
    }
    override toString(): string {
        return `${TYPEOF_ERR}(${this.#cause.toString()})`;
    }
    toInfixString(): string {
        throw new Error();
    }
    toListString(): string {
        throw new Error();
    }
}
