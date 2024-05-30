import { U } from "math-expression-tree";
import { JsAtom } from "../atom/JsAtom";

// TODO: Use the cache to intern common Flt values.
const cache: Flt[] = [];

/**
 * Constructs a floating point number object from a number primitive.
 * @param value The floating point number value.
 * @param pos The start position of the number in the source text.
 * @param end The end position of the number in the source text.
 */
export function create_flt(value: number, pos?: number, end?: number): Flt {
    if (value === zeroAsFlt.d) {
        return zeroAsFlt;
    }
    if (value === oneAsFlt.d) {
        return oneAsFlt;
    }
    if (value === negOneAsFlt.d) {
        return negOneAsFlt;
    }
    if (value === twoAsFlt.d) {
        return twoAsFlt;
    }
    if (value === negTwoAsFlt.d) {
        return negTwoAsFlt;
    }
    // console.lg("wrap_as_flt", value);
    return new Flt(value, pos, end);
}

export class Flt extends JsAtom {
    readonly type = "number";
    /**
     * Use the factory method instead. This may not exist in future.
     */
    constructor(
        public readonly d: number,
        pos?: number,
        end?: number
    ) {
        super("Flt", pos, end);
    }
    abs(): Flt {
        return this.d >= 0 ? this : this.neg();
    }
    add(rhs: Flt): Flt {
        return create_flt(this.d + rhs.d);
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
    override equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Flt) {
            return this.equalsFlt(other);
        } else {
            return false;
        }
    }
    equalsFlt(other: Flt): boolean {
        return this.d === other.d;
    }
    inv(): Flt {
        return new Flt(1 / this.d, this.pos, this.end);
    }
    isFinite(): boolean {
        return Number.isFinite(this.d);
    }
    isInteger(): boolean {
        return Number.isInteger(this.d);
    }
    isNaN(): boolean {
        return Number.isNaN(this.d);
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
    isPositive(): boolean {
        return this.d > 0;
    }
    isSafeInteger(): boolean {
        return Number.isSafeInteger(this.d);
    }
    isZero(): boolean {
        return this.d === 0;
    }
    mul(rhs: Flt): Flt {
        return create_flt(this.d * rhs.d);
    }
    neg(): Flt {
        return create_flt(-this.d);
    }
    sub(rhs: Flt): Flt {
        return create_flt(this.d - rhs.d);
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
    override toString(): string {
        return this.d.toPrecision(4);
    }
}

export function is_flt(expr: U): expr is Flt {
    return expr instanceof Flt;
}

export function assert_flt(expr: U): Flt {
    if (is_flt(expr)) {
        return expr;
    } else {
        // Don't need anything fancy here because this is an assertion for dev eyes only.
        throw new Error();
    }
}
export const zeroAsFlt = new Flt(0.0);
export const oneAsFlt = new Flt(1.0);
export const twoAsFlt = new Flt(2.0);
export const piAsFlt = new Flt(Math.PI);
export const εAsFlt = new Flt(1e-6);
export const eAsFlt = new Flt(Math.E);
export const negOneAsFlt = new Flt(-1.0);
export const negTwoAsFlt = new Flt(-2.0);

cache.push(zeroAsFlt);
cache.push(oneAsFlt);
