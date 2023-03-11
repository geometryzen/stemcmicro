import bigInt from "big-integer";
import { RBTree } from 'generic-rbtree';
import { Atom } from "../atom/Atom";
import { U } from "../tree";

//
// Our goal is to try to encapsulat the bigInt dependency so that no consumers of the Rat
// are aware of this dependency. Additionally we don't want the Rat to have dependencies
// so that it can be broken off into a standalone library.
//
// big-integer provides support for arbitrary size integers.
// generic-rbtree provides support for a cache of integers to take the load off the Garbage Collector.
//

function mmul(a: bigInt.BigInteger, b: bigInt.BigInteger): bigInt.BigInteger {
    return a.multiply(b);
}

function mdiv(a: bigInt.BigInteger, b: bigInt.BigInteger): bigInt.BigInteger {
    return a.divide(b);
}

function mcmp(a: bigInt.BigInteger, b: bigInt.BigInteger): -1 | 0 | 1 {
    return a.compare(b) as -1 | 0 | 1;
}

function madd(a: bigInt.BigInteger, b: bigInt.BigInteger): bigInt.BigInteger {
    return a.add(b);
}

function mgcd(u: bigInt.BigNumber, v: bigInt.BigNumber): bigInt.BigInteger {
    return bigInt.gcd(u, v);
}

function MSIGN(biggles: bigInt.BigInteger): -1 | 0 | 1 {
    if (biggles.isPositive()) {
        return +1;
    }
    else if (biggles.isZero()) {
        return 0;
    }
    else {
        return -1;
    }
}
/*
function MLENGTH(p: bigInt.BigInteger): number {
    return p.toString().length;
}
*/

function MZERO(p: bigInt.BigInteger): boolean {
    return p.isZero();
}

/*
function MEQUAL(p: bigInt.BigInteger, n: number): boolean {
    return p.equals(n);
}
*/

function makeSignSameAs(a: bigInt.BigInteger, b: bigInt.BigInteger): bigInt.BigInteger {
    if (a.isPositive()) {
        if (b.isNegative()) {
            return a.multiply(bigInt(-1));
        }
    }
    else {
        // a is negative
        if (b.isPositive()) {
            return a.multiply(bigInt(-1));
        }
    }
    return a;
}

function setSignTo(a: bigInt.BigInteger, b: -1 | 0 | 1): bigInt.BigInteger {
    if (a.isPositive()) {
        if (b < 0) {
            return a.multiply(bigInt(-1));
        }
    }
    else {
        // a is negative
        if (b > 0) {
            return a.multiply(bigInt(-1));
        }
    }
    return a;
}

function abs(a: bigInt.BigInteger): bigInt.BigInteger {
    if (a.isPositive()) {
        return a;
    }
    else {
        return a.multiply(bigInt(-1));
    }
}

export interface IsInteger<T> {
    isInteger(): T;
}

/**
 * "God gave us the integers, all else is the work of man" - Kronecker.
 */
export class Rat extends Atom<'Rat'> implements IsInteger<boolean> {
    /**
     * @param a The numerator.
     * @param b The denominator.
     */
    constructor(public a: bigInt.BigInteger, public b: bigInt.BigInteger, pos?: number, end?: number) {
        super('Rat', pos, end);
        // TODO: Encapsulate by making a,b private.
        // Nothing to see here (yet), but gcd processing would be nice.
        // Maybe we need a valueOf(...) static or module level function?
    }
    abs(): Rat {
        return MSIGN(this.a) >= 0 ? this : this.neg();
    }
    add(rhs: Rat): Rat {
        const numer = madd(mmul(this.a, rhs.b), mmul(this.b, rhs.a));
        if (MZERO(numer)) {
            return zero;
        }
        const bb = mmul(this.b, rhs.b);
        const gcdNbb = mgcd(numer, bb);
        const gcdNbbSS = makeSignSameAs(gcdNbb, bb);
        const a = mdiv(numer, gcdNbbSS);
        const b = mdiv(bb, gcdNbbSS);
        return new Rat(a, b);
    }
    ceiling(): Rat {
        if (this.isInteger()) {
            return this;
        }

        const result = new Rat(mdiv(this.a, this.b), bigInt.one);
        if (!this.isNegative()) {
            return result.succ();
        }
        return result;

    }
    compare(rhs: Rat): -1 | 0 | 1 {
        const ab = mmul(this.a, rhs.b);
        const ba = mmul(this.b, rhs.a);
        return mcmp(ab, ba);
    }
    denom(): Rat {
        return new Rat(bigInt(this.b), bigInt.one);
    }
    div(rhs: Rat): Rat {
        if (rhs.isZero()) {
            throw new Error('divide by zero');
        }
        if (this.isZero()) {
            return this;
        }
        const aa = mmul(this.a, rhs.b);
        const bb = mmul(this.b, rhs.a);
        const gcdAABB = mgcd(aa, bb);
        const c = makeSignSameAs(gcdAABB, bb);
        return new Rat(mdiv(aa, c), mdiv(bb, c));
    }
    equals(other: U): boolean {
        if (other instanceof Rat) {
            return this.equalsRat(other);
        }
        return false;
    }
    equalsRat(other: Rat): boolean {
        if (this === other) {
            return true;
        }
        return this.compare(other) === 0;
    }
    gcd(other: Rat): Rat {
        const a = mgcd(this.a, other.a);
        const b = mgcd(this.b, other.b);
        return new Rat(abs(a), b);
    }
    inv(): Rat {
        const a = this.a;
        const b = this.b;
        const numer = makeSignSameAs(b, a);
        const denom = setSignTo(a, 1);
        return new Rat(numer, denom, this.pos, this.end);
    }
    isDenom(n: number): boolean {
        return this.b.equals(n);
    }
    /**
     * Convenience method for !Rat.isInteger()
     */
    isFraction(): boolean {
        return !this.isInteger();
    }
    isHalf(): boolean {
        return this.isNumer(1) && this.isDenom(2);
    }
    /**
     * Convenience method for Rat.isDenom(1)
     */
    isInteger(): boolean {
        return this.isDenom(1);
    }
    isIntegerNumber(x: number): boolean {
        return this.isNumer(x) && this.isDenom(1);
    }
    isNegative(): boolean {
        return this.a.isNegative();
    }
    isNumer(n: number): boolean {
        return this.a.equals(n);
    }
    isMinusOne(): boolean {
        return this.isIntegerNumber(-1);
    }
    isOne(): boolean {
        return this.isIntegerNumber(1);
    }
    isPositive(): boolean {
        return this.a.isPositive();
    }
    isPositiveInteger(): boolean {
        return this.isPositive() && this.isInteger();
    }
    isTwo(): boolean {
        return this.isIntegerNumber(2);
    }
    isZero(): boolean {
        return MZERO(this.a);
    }
    mul(rhs: Rat): Rat {
        if (MZERO(this.a) || MZERO(rhs.a)) {
            return zero;
        }

        const aa = mmul(this.a, rhs.a);
        const bb = mmul(this.b, rhs.b);
        // TODO: Consider moving this gcd stuff to the constructor so that rational is always in lowest form?
        const gcd = mgcd(aa, bb);
        const c = makeSignSameAs(gcd, bb);

        return new Rat(mdiv(aa, c), mdiv(bb, c));
    }
    neg(): Rat {
        return new Rat(bigInt(this.a.multiply(bigInt.minusOne)), bigInt(this.b), this.pos, this.end);
    }
    numer(): Rat {
        return new Rat(bigInt(this.a), bigInt.one);
    }
    pred(): Rat {
        return this.sub(one);
    }
    sub(rhs: Rat): Rat {
        return this.add(rhs.neg());
    }
    succ(): Rat {
        return this.add(one);
    }
    toInfixString(): string {
        return this.isFraction() ? `${this.a.toString()}/${this.b.toString()}` : this.a.toString();
    }
    toListString(): string {
        return this.toInfixString();
    }
    toNumber(): number {
        const divmod = this.a.divmod(this.b);
        return divmod.quotient.toJSNumber() + divmod.remainder.toJSNumber() / this.b.toJSNumber();
    }
    toString(): string {
        const numerString = this.a.toString();
        if (this.isFraction()) {
            const denomString = this.b.toString();
            return `${this.name}(${numerString},${denomString})`;
        }
        else {
            return `${this.name}(${numerString})`;
        }
    }
}

interface Comparator<K> {
    (a: K, b: K): (-1 | 1 | 0);
}

const numberComparator: Comparator<number> = function (x: number, y: number) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
};

const lBound = -128 - 1;
const uBound = 127 + 1;
const nilValue = new Rat(bigInt(lBound), bigInt.one);
const cache: RBTree<number, Rat> = new RBTree<number, Rat>(lBound, uBound, nilValue, numberComparator);

for (let n = lBound + 1; n < uBound; n++) {
    cache.insert(n, new Rat(bigInt(n), bigInt.one));
}

/**
 * Constructor function for Num from integer which is a primitive number.
 */
export function create_int(n: number, pos?: number, end?: number): Rat {
    if (n < uBound && n > lBound) {
        return cache.search(n);
    }
    else {
        return new Rat(bigInt(n), bigInt.one, pos, end);
    }
}

export function create_rat(numer: number, denom: number, pos?: number, end?: number): Rat {
    // console.lg("wrap_as_rat", numer, denom);
    return new Rat(bigInt(numer), bigInt(denom), pos, end);
}

/**
 * The canonical representation of the identity element for ordinary multiplication. 
 */
export const one = new Rat(bigInt(1), bigInt.one);
export const two = new Rat(bigInt(2), bigInt.one);
export const three = new Rat(bigInt(3), bigInt.one);
export const four = new Rat(bigInt(4), bigInt.one);
export const five = new Rat(bigInt(5), bigInt.one);
export const six = new Rat(bigInt(6), bigInt.one);
export const seven = new Rat(bigInt(7), bigInt.one);
export const eight = new Rat(bigInt(8), bigInt.one);
export const nine = new Rat(bigInt(9), bigInt.one);
export const ten = new Rat(bigInt(10), bigInt.one);
export const eleven = new Rat(bigInt(11), bigInt.one);
export const negOne = one.neg();
export const negTwo = two.neg();
export const negThree = three.neg();
export const negFour = four.neg();
export const negFive = five.neg();
export const negSix = six.neg();
export const negSeven = seven.neg();
export const negEight = eight.neg();
export const negNine = nine.neg();
export const negTen = ten.neg();
export const negEleven = eleven.neg();
/**
 * The canonical representation of the identity element for ordinary addition. 
 */
export const zero = new Rat(bigInt(0), bigInt.one);
export const half = new Rat(bigInt(1), bigInt(2));
export const negHalf = half.neg();
export const third = new Rat(bigInt(1), bigInt(3));
