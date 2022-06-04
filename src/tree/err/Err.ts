import { Atom } from "../atom/Atom";
import { U } from "../tree";

/**
 * An error that may be used as a return value. This will not be thrown. 
 */
export class Err extends Atom {
    constructor(public message: string, pos?: number, end?: number) {
        super('Err', pos, end);
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
    toString(): string {
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
