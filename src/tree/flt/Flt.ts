import { Atom } from "../atom/Atom";
import { U } from "../tree";

/**
 * Constructs a floating point number object from a number primitive.
 * @param value The floating point number value.
 * @param pos The start position of the number in the source text.
 * @param end The end position of the number in the source text.
 */
export function wrap_as_flt(value: number, pos?: number, end?: number): Flt {
    return new Flt(value, pos, end);
}

export class Flt extends Atom {
    /**
     * Use the factory method instead. This may not exist in future.
     */
    constructor(public readonly d: number, pos?: number, end?: number) {
        super('Flt', pos, end);
    }
    abs(): Flt {
        return this.d >= 0 ? this : this.neg();
    }
    add(rhs: Flt): Flt {
        return wrap_as_flt(this.d + rhs.d);
    }
    compare(other: Flt): 1 | -1 | 0 {
        if (this.d > other.d) {
            return 1;
        }
        if (this.d < other.d) {
            return -1;
        }
        return 0;
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Flt) {
            return this.equalsFlt(other);
        }
        else {
            return false;
        }
    }
    equalsFlt(other: Flt): boolean {
        return this.d === other.d;
    }
    inv(): Flt {
        return new Flt(1 / this.d, this.pos, this.end);
    }
    /**
     * Returns true if this number is less than zero.
     */
    isNegative(): boolean {
        return this.d < 0;
    }
    isMinusOne(): boolean {
        return this.d === -1;
    }
    isOne(): boolean {
        return this.d === 1;
    }
    isZero(): boolean {
        return this.d === 0;
    }
    mul(rhs: Flt): Flt {
        return wrap_as_flt(this.d * rhs.d);
    }
    neg(): Flt {
        return wrap_as_flt(-this.d);
    }
    toInfixString(): string {
        return `${this.d}`;
    }
    toListString(): string {
        return `${this.d}`;
    }
    toNumber(): number {
        return this.d;
    }
    toString(): string {
        return `${this.name}(${this.d})`;
    }
}

export const zeroAsDouble = wrap_as_flt(0.0);
export const oneAsDouble = wrap_as_flt(1.0);
export const piAsDouble = wrap_as_flt(Math.PI);
export const εAsDouble = wrap_as_flt(1e-6);
export const eAsDouble = wrap_as_flt(Math.E);
export const negOneAsDouble = wrap_as_flt(-1.0);
