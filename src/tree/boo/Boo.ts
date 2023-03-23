import { Atom } from "../atom/Atom";
import { U } from "../tree";

/**
 * Fuzzy Logical Boolean.
 */
export class Boo extends Atom<'Boo'> {
    constructor(private readonly b: boolean | undefined, pos?: number, end?: number) {
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
        if (typeof this.b === 'boolean') {
            return this.b;
        }
        else {
            return false;
        }
    }
    isFalse(): boolean {
        if (typeof this.b === 'boolean') {
            return !this.b;
        }
        else {
            return false;
        }
    }
    toString(): string {
        return this.b ? `${this.name}(true)` : `${this.name}(false)`;
    }
    static valueOf(b: boolean | undefined): Boo {
        if (typeof b === 'boolean') {
            return b ? booT : booF;
        }
        else if (typeof b === 'undefined') {
            return booU;
        }
        else {
            throw new Error();
        }
    }
}

export function create_boo(b: boolean | undefined): Boo {
    return Boo.valueOf(b);
}

export const booT = new Boo(true);
export const booF = new Boo(false);
export const booU = new Boo(void 0);