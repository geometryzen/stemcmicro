import { Atom } from "../atom/Atom";
import { U } from "../tree";

/**
 * The implementation of a Logical Boolean value.
 */
export class Boo extends Atom {
    constructor(private readonly b: boolean, pos?: number, end?: number) {
        super('Boo', pos, end);
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Boo) {
            return this.equalsBoo(other);
        }
        else {
            return false;
        }
    }
    equalsBoo(other: Boo): boolean {
        return this.b === other.b;
    }
    isTrue(): boolean {
        return this.b;
    }
    toString(): string {
        return this.b ? `${this.name}(true)` : `${this.name}(false)`;
    }
    static valueOf(b: boolean): Boo {
        return b ? True : False;
    }
}

export const True = new Boo(true);
export const False = new Boo(false);