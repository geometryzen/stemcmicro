import { U } from "../tree";

/**
 * An error that may be used as a return value. This will not be thrown. 
 */
export class Err implements U {
    constructor(public message: string, public readonly pos?: number, public readonly end?: number) {
        // Nothing to see here.I
    }
    get name(): string {
        return 'Err';
    }
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    equals(other: U): boolean {
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
        return this.message === other.message;
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    toCtorString(): string {
        return `${this.name}()`;
    }
    toInfixString(): string {
        throw new Error("Err.toInfixString() Method not implemented.");
    }
    toListString(): string {
        throw new Error("Err.toListString() Method not implemented.");
    }
}

export const oops = new Err("Something is rotten in the state of Denmark");
