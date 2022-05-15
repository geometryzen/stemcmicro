import { U } from "../tree";

export function flt(d: number, pos?: number, end?: number): Flt {
    return new Flt(d, pos, end);
}

export class Flt implements U {
    /**
     * Use the factory method instead. This may not exist in future.
     */
    constructor(public d: number, public readonly pos?: number, public readonly end?: number) {
        // Nothing to see here.
        // Maybe do a sanity check on typeof d === 'number'? 
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    get name(): string {
        return 'Flt';
    }
    abs(): Flt {
        return this.d >= 0 ? this : this.neg();
    }
    add(rhs: Flt): Flt {
        return flt(this.d + rhs.d);
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
    contains(needle: U): boolean {
        return this.equals(needle);
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
        return flt(this.d * rhs.d);
    }
    neg(): Flt {
        return flt(-this.d);
    }
    toCtorString(): string {
        return `${this.name}(${this.d})`;
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
        // TODO: Serialize in floating point notation, be done with Flt(...) wrapper.
        return `Flt(${this.d})`;
    }

    // These flags are not actually set, they're only used for typechecking.
    // Don't use them directly.
    __ts_sign?: -1 | 0 | 1;
    __ts_integer?: boolean;
    __ts_special?: number;
}

export const zeroAsDouble = flt(0.0);
export const oneAsDouble = flt(1.0);
export const piAsDouble = flt(Math.PI);
export const εAsDouble = flt(1e-6);
export const eAsDouble = flt(Math.E);
export const negOneAsDouble = flt(-1.0);
