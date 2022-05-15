import { U } from "../tree";

/**
 * The implementation of a Logical Boolean value.
 */
export class Boo implements U {
    public readonly name = 'Boo';
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(private readonly b: boolean, public readonly pos?: number, public readonly end?: number) {
    }
    contains(needle: U): boolean {
        return this.equals(needle);
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
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    isTrue(): boolean {
        return this.b;
    }
    toString(): string {
        return this.b ? `${this.name}(true)` : `${this.name}(false)`;
    }
}

export function create_boolean(b: boolean): Boo {
    return b ? True : False;
}

export const True = new Boo(true);
export const False = new Boo(false);