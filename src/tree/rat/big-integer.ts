import {
    addAny,
    addSmall,
    arrayToSmall,
    BASE,
    DEFAULT_ALPHABET,
    divMod1,
    divMod2,
    divModSmall,
    isPrecise,
    LOG_BASE,
    MAX_INT,
    MAX_INT_ARR,
    multiplyKaratsuba,
    multiplyLong,
    multiplySmall,
    smallToArray,
    square,
    subtract,
    trim,
    truncate,
    useKaratsuba
} from './big-helpers';

export interface BigInteger {
    abs(): BigInteger;
    add(rhs: number | string | BigInteger): BigInteger;
    bitLength(): BigInteger;
    compare(rhs: BigInteger): 1 | 0 | -1;
    compareAbs(rhs: number | string): 1 | 0 | -1;
    compareTo(rhs: BigInteger): 1 | 0 | -1;
    multiply(rhs: number | string | BigInteger): BigInteger;
    divide(rhs: number | string | BigInteger): BigInteger;
    equals(n: number | string | BigInteger): boolean;
    lesser(rhs: number | string | BigInteger): boolean;
    lesserOrEquals(rhs: number | string | BigInteger): boolean;
    leq(n: number | string | BigInteger): boolean;
    geq(n: number | string | BigInteger): boolean;
    greater(rhs: number | string | BigInteger): boolean;
    greaterOrEquals(rhs: number | string | BigInteger): boolean;
    isDivisibleBy(n: number): boolean;
    isEven(): boolean;
    isNegative(): boolean;
    isOdd(): boolean;
    isPositive(): boolean;
    isPrime(): boolean;
    isProbablePrime(iterations?: number, randomNumberGenerator?: () => number): boolean;
    isUnit(): boolean;
    isZero(): boolean;
    minus(rhs: number | string | BigInteger): BigInteger;
    mod(rhs: number | string | BigInteger): BigInteger;
    modInv(x: number): BigInteger;
    modPow(x: number, y: number | string): BigInteger;
    negate(): BigInteger;
    next(): BigInteger;
    notEquals(n: number | string | BigInteger): boolean;
    over(denom: number | string | BigInteger): BigInteger;
    plus(rhs: number | string | BigInteger): BigInteger;
    pow(expo: number | string | BigInteger): BigInteger;
    prev(): BigInteger;
    divmod(rhs: BigInteger): { quotient: BigInteger, remainder: BigInteger };
    square(): BigInteger;
    shiftLeft(n: number | string | BigInteger): BigInteger;
    shiftRight(n: number | string | BigInteger): BigInteger;
    subtract(rhs: number | string | BigInteger): BigInteger;
    times(n: number | string | BigInteger): BigInteger;
    toArray(radix: number): { value: number[]; isNegative: boolean };
    toJSNumber(): number;
    toString(radix?: number, alphabet?: string): string;
    valueOf(): number;
}

const cache: BigInteger[] = [];

export const bigInt = (function (/*undefined*/) {

    // If we have native support for BigInt then SmallInteger and LargeInteger are redundant.
    // The unit tests should work if this variable is set to false.
    const supportsNativeBigInt = typeof BigInt === "function";
    // console.lg("supportsNativeBigInt", supportsNativeBigInt);

    /**
     * This is (also) the constructor function.
     * @param v 
     * @param radix 
     * @param alphabet 
     * @param caseSensitive 
     * @returns 
     */
    function Integer(v?, radix?: number | string, alphabet?: string, caseSensitive?: boolean) {
        if (typeof v === "undefined") return cache[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
    }

    class SmallInteger implements BigInteger {
        value: number;
        sign: boolean;
        isSmall: boolean;
        constructor(value: number) {
            this.value = value;
            this.sign = value < 0;
            this.isSmall = true;
        }
        abs(): BigInteger {
            return new SmallInteger(Math.abs(this.value));
        }
        add(v: BigInteger) {
            const n = parseValue(v);
            const a = this.value;
            if (a < 0 !== n.sign) {
                return this.subtract(n.negate());
            }
            let b = n.value;
            if (n.isSmall) {
                if (isPrecise(a + b)) return new SmallInteger(a + b);
                b = smallToArray(Math.abs(b));
            }
            return new LargeInteger(addSmall(b, Math.abs(a)), a < 0);
        }
        bitLength() {
            let n = this;
            if (n.compareTo(bigInt(0)) < 0) {
                n = n.negate().subtract(bigInt(1));
            }
            if (n.compareTo(bigInt(0)) === 0) {
                return bigInt(0);
            }
            return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
        }
        compareAbs(v: BigInteger): 1 | 0 | -1 {
            const n = parseValue(v);
            const a = Math.abs(this.value);
            if (n instanceof SmallInteger) {
                const b = Math.abs(n.value);
                return a === b ? 0 : a > b ? 1 : -1;
            }
            else if (n instanceof LargeInteger) {
                return -1;
            }
            else {
                throw new Error();
            }
        }
        compare(v: number | BigInteger) {
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }

            const n = parseValue(v);
            const a = this.value;
            if (n instanceof SmallInteger) {
                const b = n.value;
                return a == b ? 0 : a > b ? 1 : -1;
            }
            if (a < 0 !== n.sign) {
                return a < 0 ? -1 : 1;
            }
            return a < 0 ? 1 : -1;
        }
        compareTo(v: number | BigInteger): 1 | 0 | -1 {
            return this.compare(v);
        }
        divide(v: number | string | BigInteger) {
            return divModAny(this, v)[0];
        }
        divmod(v: BigInteger) {
            const result = divModAny(this, v);
            return {
                quotient: result[0],
                remainder: result[1]
            };
        }
        isEven() {
            return (this.value & 1) === 0;
        }
        isNegative(): boolean {
            return this.value < 0;
        }
        isPositive(): boolean {
            return this.value > 0;
        }
        isUnit() {
            return Math.abs(this.value) === 1;
        }
        minus(v: BigInteger) {
            return this.subtract(v);
        }
        mod(v: BigInteger) {
            return divModAny(this, v)[1];
        }
        next(): BigInteger {
            const value = this.value;
            if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
            return new LargeInteger(MAX_INT_ARR, false);
        }
        over(v: number | string | BigInteger) {
            return this.divide(v);
        }
        plus(v: BigInteger) {
            return this.add(v);
        }
        prev(): BigInteger {
            const value = this.value;
            if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
            return new LargeInteger(MAX_INT_ARR, true);
        }
        square(): BigInteger {
            const value = this.value * this.value;
            if (isPrecise(value)) return new SmallInteger(value);
            return new LargeInteger(square(smallToArray(Math.abs(this.value))), false);
        }
        subtract(v: BigInteger): BigInteger {
            const n = parseValue(v);
            const a = this.value;
            if (a < 0 !== n.sign) {
                return this.add(n.negate());
            }
            if (n instanceof SmallInteger) {
                const b = n.value;
                return new SmallInteger(a - b);
            }
            else if (n instanceof LargeInteger) {
                const b = n.value;
                return subtractSmall(b, Math.abs(a), a >= 0);
            }
            else {
                throw new Error();
            }
        }
        times(v: BigInteger) {
            return this.multiply(v);
        }
        toString(radix?: number, alphabet?: string): string {
            if (radix === undefined) radix = 10;
            if (radix != 10) return toBaseString(this, radix, alphabet);
            return String(this.value);
        }
        negate(): BigInteger {
            const sign = this.sign;
            const small = new SmallInteger(-this.value);
            small.sign = !sign;
            return small;
        }
        multiply(v: BigInteger) {
            return parseValue(v)._multiplyBySmall(this);
        }
        _multiplyBySmall(a: SmallInteger) {
            if (isPrecise(a.value * this.value)) {
                return new SmallInteger(a.value * this.value);
            }
            return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
        }
        valueOf(): number {
            return this.value;
        }
    }

    class LargeInteger implements BigInteger {
        value: number[];
        /**
         * Indicates that the effective value should be treated as negative.
         */
        sign: boolean;
        isSmall: boolean;
        constructor(value: number[], sign: boolean) {
            this.value = value;
            this.sign = sign;
            this.isSmall = false;
        }
        abs(): BigInteger {
            return new LargeInteger(this.value, false);
        }
        add(v: BigInteger): BigInteger {
            const n = parseValue(v);
            if (this.sign !== n.sign) {
                return this.subtract(n.negate());
            }
            const a = this.value;
            const b = n.value;
            if (n.isSmall) {
                return new LargeInteger(addSmall(a, Math.abs(b)), this.sign);
            }
            return new LargeInteger(addAny(a, b), this.sign);
        }
        bitLength() {
            let n = this;
            if (n.compareTo(bigInt(0)) < 0) {
                n = n.negate().subtract(bigInt(1));
            }
            if (n.compareTo(bigInt(0)) === 0) {
                return bigInt(0);
            }
            return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
        }
        compare(v: number | BigInteger): 1 | 0 | -1 {
            // See discussion about comparison with Infinity:
            // https://github.com/peterolson/LargeInteger.js/issues/61
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }

            const n = parseValue(v);
            const a = this.value;
            if (this.sign !== n.sign) {
                return n.sign ? 1 : -1;
            }
            if (n instanceof SmallInteger) {
                return this.sign ? -1 : 1;
            }
            if (n instanceof LargeInteger) {
                const b = n.value;
                switch (compareAbs(a, b)) {
                    case 1: return this.sign ? -1 : 1;
                    case 0: return 0;
                    default: return this.sign ? 1 : -1;
                }
            }
            else {
                throw new Error();
            }
        }
        compareAbs(v: BigInteger) {
            const n = parseValue(v);
            const a = this.value;
            if (n instanceof SmallInteger) {
                return 1;
            }
            else if (n instanceof LargeInteger) {
                const b = n.value;
                return compareAbs(a, b);
            }
            else {
                throw new Error();
            }
        }
        compareTo(v: number | BigInteger): 1 | 0 | -1 {
            return this.compare(v);
        }
        divide(v: BigInteger) {
            return divModAny(this, v)[0];
        }
        divmod(v: BigInteger) {
            const result = divModAny(this, v);
            return {
                quotient: result[0],
                remainder: result[1]
            };
        }
        isEven() {
            return (this.value[0] & 1) === 0;
        }
        isProbablePrime(iterations: number, rng) {
            const isPrime = isBasicPrime(this);
            if (isPrime !== undefined) return isPrime;
            const n = this.abs();
            const t = iterations === undefined ? 5 : iterations;
            const a: number[] = [];
            for (let i = 0; i < t; i++) {
                a.push(bigInt.randBetween(2, n.minus(2), rng));
            }
            return millerRabinTest(n, a);
        }
        isPrime(strict: boolean) {
            // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
            const isPrime = isBasicPrime(this);
            if (isPrime !== undefined) return isPrime;
            const n = this.abs();
            const bits = n.bitLength();
            if (bits <= 64) {
                return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
            }
            const logN = Math.log(2) * bits.toJSNumber();
            const t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
            const a: number[] = [];
            for (let i = 0; i < t; i++) {
                a.push(bigInt(i + 2));
            }
            return millerRabinTest(n, a);
        }
        isPositive() {
            return !this.sign;
        }
        isNegative() {
            return this.sign;
        }
        isUnit(): boolean {
            return false;
        }
        minus(v: BigInteger) {
            return this.subtract(v);
        }
        mod(v: BigInteger) {
            return divModAny(this, v)[1];
        }
        next() {
            const value = this.value;
            if (this.sign) {
                return subtractSmall(value, 1, this.sign);
            }
            return new LargeInteger(addSmall(value, 1), this.sign);
        }
        over(v: BigInteger) {
            return this.divide(v);
        }
        plus(v: BigInteger) {
            return this.add(v);
        }
        pow(v: BigInteger) {
            const n = parseValue(v);
            const a = this.value;
            let b = n.value;
            if (b === 0) return cache[1];
            if (a === 0) return cache[0];
            if (a === 1) return cache[1];
            if (a === -1) return n.isEven() ? cache[1] : cache[-1];
            if (n.sign) {
                return cache[0];
            }
            if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
            if (this.isSmall) {
                const value = Math.pow(a, b);
                if (isPrecise(value)) {
                    return new SmallInteger(truncate(value));
                }
            }
            let x = this;
            let y = cache[1];
            while (true) {
                if (b & 1 === 1) {
                    y = y.times(x);
                    --b;
                }
                if (b === 0) break;
                b /= 2;
                x = x.square();
            }
            return y;
        }
        prev() {
            const value = this.value;
            if (this.sign) {
                return new LargeInteger(addSmall(value, 1), true);
            }
            return subtractSmall(value, 1, this.sign);
        }
        square() {
            return new LargeInteger(square(this.value), false);
        }
        subtract(v: BigInteger) {
            const n = parseValue(v);
            if (this.sign !== n.sign) {
                return this.add(n.negate());
            }
            const a = this.value, b = n.value;
            if (n.isSmall)
                return subtractSmall(a, Math.abs(b), this.sign);
            return subtractAny(a, b, this.sign);
        }
        times(v: BigInteger) {
            return this.multiply(v);
        }
        toString(radix?: number, alphabet?: string): string {
            if (radix === undefined) radix = 10;
            if (radix !== 10) return toBaseString(this, radix, alphabet);
            const v = this.value;
            let l = v.length;
            let str = String(v[--l]);
            const zeros = "0000000";
            let digit: string;
            while (--l >= 0) {
                digit = String(v[l]);
                str += zeros.slice(digit.length) + digit;
            }
            const sign = this.sign ? "-" : "";
            return sign + str;
        }
        negate() {
            return new LargeInteger(this.value, !this.sign);
        }
        multiply(v: number | BigInteger) {
            const n = parseValue(v);
            const a = this.value;
            const sign = this.sign !== n.sign;
            let b: number[];
            if (n instanceof SmallInteger) {
                const sv = n.value;
                if (sv === 0) return cache[0];
                if (sv === 1) return this;
                if (sv === -1) return this.negate();
                const abs = Math.abs(sv);
                if (abs < BASE) {
                    return new LargeInteger(multiplySmall(a, abs), sign);
                }
                b = smallToArray(abs);
            }
            else if (n instanceof LargeInteger) {
                b = n.value;
            }
            else {
                throw new Error();
            }
            if (useKaratsuba(a.length, b.length)) {// Karatsuba is only faster for certain array sizes
                return new LargeInteger(multiplyKaratsuba(a, b), sign);
            }
            return new LargeInteger(multiplyLong(a, b), sign);
        }
        _multiplyBySmall(a: SmallInteger) {
            if (a.value === 0) return cache[0];
            if (a.value === 1) return this;
            if (a.value === -1) return this.negate();
            return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
        }
        valueOf(): number {
            return parseInt(this.toString(), 10);
        }
    }

    class NativeBigInt implements BigInteger {
        value: bigint;
        constructor(value: bigint) {
            this.value = value;
        }
        abs() {
            return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
        }
        add(v: BigInteger) {
            return new NativeBigInt(this.value + parseValue(v).value);
        }
        bitLength() {
            let n = this;
            if (n.compareTo(bigInt(0)) < 0) {
                n = n.negate().subtract(bigInt(1));
            }
            if (n.compareTo(bigInt(0)) === 0) {
                return bigInt(0);
            }
            return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
        }
        compareAbs(v: BigInteger) {
            let a = this.value;
            let b = parseValue(v).value;
            a = a >= 0 ? a : -a;
            b = b >= 0 ? b : -b;
            return a === b ? 0 : a > b ? 1 : -1;
        }
        compare(v: number | BigInteger): 1 | 0 | -1 {
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }
            const a = this.value;
            const b = parseValue(v).value;
            return a === b ? 0 : a > b ? 1 : -1;
        }
        compareTo(v: number | BigInteger): 1 | 0 | -1 {
            return this.compare(v);
        }
        divide(v: BigInteger) {
            return new NativeBigInt(this.value / parseValue(v).value);
        }
        divmod(v: BigInteger) {
            const result = divModAny(this, v);
            return {
                quotient: result[0],
                remainder: result[1]
            };
        }
        isEven(): boolean {
            return (this.value & BigInt(1)) === BigInt(0);
        }
        isOdd(): boolean {
            return (this.value & BigInt(1)) === BigInt(1);
        }
        isPositive(): boolean {
            return this.value > 0;
        }
        isNegative(): boolean {
            return this.value < 0;
        }
        isUnit(): boolean {
            return this.abs().value === BigInt(1);
        }
        isZero(): boolean {
            return this.value === BigInt(0);
        }
        mod(v: BigInteger) {
            return new NativeBigInt(this.value % parseValue(v).value);
        }
        next() {
            return new NativeBigInt(this.value + BigInt(1));
        }
        plus(v: BigInteger) {
            return this.add(v);
        }
        pow(v: NativeBigInt) {
            const n = parseValue(v) as NativeBigInt;
            const a = this.value;
            let b = n.value;
            const _0 = BigInt(0);
            const _1 = BigInt(1);
            const _2 = BigInt(2);
            if (b === _0) return cache[1];
            if (a === _0) return cache[0];
            if (a === _1) return cache[1];
            if (a === BigInt(-1)) return n.isEven() ? cache[1] : cache[-1];
            if (n.isNegative()) return new NativeBigInt(_0);
            let x = this;
            let y = cache[1];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if ((b & _1) === _1) {
                    y = y.times(x);
                    --b;
                }
                if (b === _0) break;
                b /= _2;
                x = x.square();
            }
            return y;
        }
        prev() {
            return new NativeBigInt(this.value - BigInt(1));
        }
        square() {
            return new NativeBigInt(this.value * this.value);
        }
        subtract(v: BigInteger) {
            return new NativeBigInt(this.value - parseValue(v).value);
        }
        toString(radix?: number, alphabet?: string): string {
            if (radix === undefined) radix = 10;
            if (radix != 10) return toBaseString(this, radix, alphabet);
            return String(this.value);
        }
        minus(v: BigInteger) {
            return this.subtract(v);
        }
        multiply(v: BigInteger): BigInteger {
            return new NativeBigInt(this.value * parseValue(v).value);
        }
        negate() {
            return new NativeBigInt(-this.value);
        }
        over(v: BigInteger) {
            return this.divide(v);
        }
        times(v: BigInteger): BigInteger {
            return this.multiply(v);
        }
    }

    // LargeInteger.prototype.plus = LargeInteger.prototype.add;
    // SmallInteger.prototype.plus = SmallInteger.prototype.add;

    function subtractAny(a: number[], b: number[], sign: boolean) {
        let difference: number[];
        if (compareAbs(a, b) >= 0) {
            difference = subtract(a, b);
        }
        else {
            difference = subtract(b, a);
            sign = !sign;
        }
        let value = arrayToSmall(difference);
        if (typeof value === "number") {
            if (sign) value = -value;
            return new SmallInteger(value);
        }
        return new LargeInteger(value, sign);
    }

    function subtractSmall(a: number[], b: number, sign: boolean) { // assumes a is array, b is number with 0 <= b < MAX_INT
        const l = a.length;
        const s = new Array<number>(l);
        let carry = -b;
        const base = BASE;
        for (let i = 0; i < l; i++) {
            let difference = a[i] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            s[i] = difference < 0 ? difference + base : difference;
        }
        let r = arrayToSmall(s);
        if (typeof r === "number") {
            if (sign) r = -r;
            return new SmallInteger(r);
        }
        return new LargeInteger(r, sign);
    }

    // LargeInteger.prototype.minus = LargeInteger.prototype.subtract;
    // SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

    // LargeInteger.prototype.times = LargeInteger.prototype.multiply;
    // SmallInteger.prototype.times = SmallInteger.prototype.multiply;

    function multiplySmallAndArray(a: number, b: number[], sign: boolean) { // a >= 0
        if (a < BASE) {
            return new LargeInteger(multiplySmall(b, a), sign);
        }
        return new LargeInteger(multiplyLong(b, smallToArray(a)), sign);
    }

    function divModAny(self: BigInteger, v: BigInteger) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
        }
        var a = self.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [cache[0], self];
        }
        if (n.isSmall) {
            if (b === 1) return [self, cache[0]];
            if (b == -1) return [self.negate(), cache[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign) remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign) quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new LargeInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        const comparison = compareAbs(a, b);
        if (comparison === -1) return [cache[0], self];
        if (comparison === 0) return [cache[self.sign === n.sign ? 1 : -1], cache[0]];

        // divMod1 is faster on smaller input sizes
        if (a.length + b.length <= 200)
            value = divMod1(a, b);
        else value = divMod2(a, b);

        quotient = value[0];
        var qSign = self.sign !== n.sign,
            mod = value[1],
            mSign = self.sign;
        if (typeof quotient === "number") {
            if (qSign) quotient = -quotient;
            quotient = new SmallInteger(quotient);
        }
        else quotient = new LargeInteger(quotient, qSign);
        if (typeof mod === "number") {
            if (mSign) mod = -mod;
            mod = new SmallInteger(mod);
        }
        else mod = new LargeInteger(mod, mSign);
        return [quotient, mod];
    }

    // SmallInteger.prototype.over = SmallInteger.prototype.divide = LargeInteger.prototype.over = LargeInteger.prototype.divide;

    // SmallInteger.prototype.remainder = SmallInteger.prototype.mod = LargeInteger.prototype.remainder = LargeInteger.prototype.mod;

    SmallInteger.prototype.pow = LargeInteger.prototype.pow;

    LargeInteger.prototype.modPow = function (exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = cache[1],
            base = this.mod(mod);
        if (exp.isNegative()) {
            exp = exp.multiply(cache[-1]);
            base = base.modInv(mod);
        }
        while (exp.isPositive()) {
            if (base.isZero()) return cache[0];
            if (exp.isOdd()) r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
        }
        return r;
    };
    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = LargeInteger.prototype.modPow;

    function compareAbs(a: number[], b: number[]): 1 | 0 | -1 {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (let i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }


    LargeInteger.prototype.equals = function (v) {
        return this.compare(v) === 0;
    };
    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = LargeInteger.prototype.eq = LargeInteger.prototype.equals;

    LargeInteger.prototype.notEquals = function (v) {
        return this.compare(v) !== 0;
    };
    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = LargeInteger.prototype.neq = LargeInteger.prototype.notEquals;

    LargeInteger.prototype.greater = function (v) {
        return this.compare(v) > 0;
    };
    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = LargeInteger.prototype.gt = LargeInteger.prototype.greater;

    LargeInteger.prototype.lesser = function (v) {
        return this.compare(v) < 0;
    };
    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = LargeInteger.prototype.lt = LargeInteger.prototype.lesser;

    LargeInteger.prototype.greaterOrEquals = function (v) {
        return this.compare(v) >= 0;
    };
    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = LargeInteger.prototype.geq = LargeInteger.prototype.greaterOrEquals;

    LargeInteger.prototype.lesserOrEquals = function (v) {
        return this.compare(v) <= 0;
    };
    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = LargeInteger.prototype.leq = LargeInteger.prototype.lesserOrEquals;

    LargeInteger.prototype.isOdd = function () {
        return (this.value[0] & 1) === 1;
    };
    SmallInteger.prototype.isOdd = function () {
        return (this.value & 1) === 1;
    };

    LargeInteger.prototype.isZero = function () {
        return false;
    };
    SmallInteger.prototype.isZero = function () {
        return this.value === 0;
    };

    LargeInteger.prototype.isDivisibleBy = function (v) {
        const n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
    };
    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = LargeInteger.prototype.isDivisibleBy;

    function isBasicPrime(v: BigInteger): boolean {
        const n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
        // we don't know if it's prime: let the other functions figure it out
    }

    function millerRabinTest(n: BigInteger, a: number[]): boolean {
        const nPrev = n.prev();
        let b = nPrev;
        let r = 0;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (let i = 0; i < a.length; i++) {
            if (n.lesser(a[i])) continue;
            let x = bigInt(a[i]).modPow(b, n);
            if (x.isUnit() || x.equals(nPrev)) continue;
            for (let d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit()) return false;
                if (x.equals(nPrev)) continue next;
            }
            return false;
        }
        return true;
    }

    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = LargeInteger.prototype.isPrime;

    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = LargeInteger.prototype.isProbablePrime;

    LargeInteger.prototype.modInv = function (n) {
        let t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
            t = t.add(n);
        }
        if (this.isNegative()) {
            return t.negate();
        }
        return t;
    };

    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = LargeInteger.prototype.modInv;

    const powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    const powers2Length = powersOfTwo.length;
    const highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n: number): boolean {
        return Math.abs(n) <= BASE;
    }

    LargeInteger.prototype.shiftLeft = function (v) {
        let n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        let result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
    };
    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = LargeInteger.prototype.shiftLeft;

    LargeInteger.prototype.shiftRight = function (v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
    };
    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = LargeInteger.prototype.shiftRight;

    function bitwise(x: BigInteger, y: BigInteger, fn) {
        y = parseValue(y);
        const xSign = x.isNegative();
        const ySign = y.isNegative();
        let xRem = xSign ? x.not() : x;
        let yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
            }

            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
            }

            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
        }
        let sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (let i = result.length - 1; i >= 0; i -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
        }
        return sum;
    }

    LargeInteger.prototype.not = function () {
        return this.negate().prev();
    };
    NativeBigInt.prototype.not = SmallInteger.prototype.not = LargeInteger.prototype.not;

    LargeInteger.prototype.and = function (n) {
        return bitwise(this, n, function (a, b) { return a & b; });
    };
    NativeBigInt.prototype.and = SmallInteger.prototype.and = LargeInteger.prototype.and;

    LargeInteger.prototype.or = function (n) {
        return bitwise(this, n, function (a, b) { return a | b; });
    };
    NativeBigInt.prototype.or = SmallInteger.prototype.or = LargeInteger.prototype.or;

    LargeInteger.prototype.xor = function (n) {
        return bitwise(this, n, function (a, b) { return a ^ b; });
    };
    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = LargeInteger.prototype.xor;

    const LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) { // get lowestOneBit (rough)
        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
        // LargeInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
        var v = n.value,
            x = typeof v === "number" ? v | LOBMASK_I :
                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                    v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }

    function integerLogarithm(value: BigInteger, base: BigInteger): { p: BigInteger, e: number } {
        if (base.compareTo(value) <= 0) {
            const tmp = integerLogarithm(value, base.square(base));
            const p = tmp.p;
            const e = tmp.e;
            const t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
    }


    function max(a: number | BigInteger, b: number | BigInteger): BigInteger {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a: number | BigInteger, b: number | BigInteger): BigInteger {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
    }
    function gcd(a: number | BigInteger, b: number | BigInteger): BigInteger {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        let c = cache[1];
        let d: BigInteger;
        while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            let t: BigInteger;
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                t = b; b = a; a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    function lcm(a: number | BigInteger, b: number | BigInteger): BigInteger {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }

    function randBetween(a: number | string, b: number | string, rng?: () => number) {
        const iA = parseValue(a);
        const iB = parseValue(b);
        const usedRNG = rng || Math.random;
        const low = min(iA, iB);
        const high = max(iA, iB);
        const range = high.subtract(low).add(1);
        if (range instanceof SmallInteger) return low.add(Math.floor(usedRNG() * range.valueOf()));
        const digits = toBase(range, BASE).value;
        const result: number[] = [];
        let restricted = true;
        for (let i = 0; i < digits.length; i++) {
            const top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
            const digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < digits[i]) {
                restricted = false;
            }
        }
        return low.add(Integer.fromArray(result, BASE, false));
    }

    const parseBase = function (input: unknown, radix: number, alphabet: string | undefined, caseSensitive: boolean) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        let text = String(input);
        if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
        }
        const length = text.length;
        const absBase = Math.abs(radix);
        const alphabetValues: { [key: string]: number } = {};
        for (let i = 0; i < alphabet.length; i++) {
            alphabetValues[alphabet[i]] = i;
        }
        for (let i = 0; i < length; i++) {
            const c = text[i];
            if (c === "-") continue;
            if (c in alphabetValues) {
                if (alphabetValues[c] >= absBase) {
                    if (c === "1" && absBase === 1) continue;
                    throw new Error(c + " is not a valid digit in base " + radix + ".");
                }
            }
        }
        const base = parseValue(radix);
        const digits: Bigcache[] = [];
        const isNegative = text[0] === "-";
        for (let i = isNegative ? 1 : 0; i < text.length; i++) {
            const c = text[i];
            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
                const start = i;
                do {
                    i++;
                } while (text[i] !== ">" && i < text.length);
                digits.push(parseValue(text.slice(start + 1, i)));
            }
            else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
    };

    function parseBaseFromArray(digits: Bigcache[], base: BigInteger, isNegative: boolean): BigInteger {
        let val = cache[0] as BigInteger;
        let pow = cache[1] as BigInteger;
        for (let i = digits.length - 1; i >= 0; i--) {
            val = val.add(digits[i].times(pow));
            pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
    }

    function stringify(digit: number, alphabet?: string): string {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
            return alphabet[digit];
        }
        return "<" + digit + ">";
    }

    function toBase(n: BigInteger, radix: number) {
        const base = bigInt(radix) as BigInteger;
        if (base.isZero()) {
            if (n.isZero()) return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero()) return { value: [0], isNegative: false };
            if (n.isNegative())
                return {
                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                        .map(Array.prototype.valueOf, [1, 0])
                    ),
                    isNegative: false
                };

            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                .map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
                value: [].concat.apply([], arr),
                isNegative: false
            };
        }

        let neg = false;
        if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
        }
        if (base.isUnit()) {
            if (n.isZero()) return { value: [0], isNegative: false };

            return {
                value: Array.apply(null, Array(n.toJSNumber()))
                    .map(Number.prototype.valueOf, 1),
                isNegative: neg
            };
        }
        const out = [];
        let left = n;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            const divmod = left.divmod(base);
            left = divmod.quotient;
            let digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
    }

    function toBaseString(n: BigInteger, base: number, alphabet?: string): string {
        const arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
            return stringify(x, alphabet);
        }).join('');
    }

    LargeInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    SmallInteger.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toArray = function (radix) {
        return toBase(this, radix);
    };

    NativeBigInt.prototype.toJSON = LargeInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); }

    LargeInteger.prototype.toJSNumber = LargeInteger.prototype.valueOf;

    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
        return parseInt(this.toString(), 10);
    };

    function parseStringValue(v: string): SmallInteger | LargeInteger | NativeBigInt {
        if (isPrecise(+v)) {
            const x = +v;
            if (x === truncate(x))
                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
        }
        const sign = v[0] === "-";
        if (sign) v = v.slice(1);
        const split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            let expo = split[1];
            if (expo[0] === "+") expo = expo.slice(1);
            let exp = +expo;
            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            let text = split[0];
            const decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        const isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        const r: number[] = [];
        let max = v.length;
        const l = LOG_BASE;
        let min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0) min = 0;
            max -= l;
        }
        trim(r);
        return new LargeInteger(r, sign);
    }

    function parseNumberValue(v: number): SmallInteger | LargeInteger | NativeBigInt {
        if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }

    function parseValue(v: number | string | bigint | BigInteger): BigInteger {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        if (typeof v === "string") {
            return parseStringValue(v);
        }
        if (typeof v === "bigint") {
            return new NativeBigInt(v);
        }
        return v;
    }
    // Pre-define numbers in range [-999,999]
    for (let i = 0; i < 1000; i++) {
        cache[i] = parseValue(i);
        if (i > 0) cache[-i] = parseValue(-i);
    }
    // Backwards compatibility
    Integer.one = cache[1];
    Integer.zero = cache[0];
    Integer.minusOne = cache[-1];
    Integer.max = max;
    Integer.min = min;
    Integer.gcd = gcd;
    Integer.lcm = lcm;
    Integer.isInstance = function (x: unknown): x is BigInteger {
        return x instanceof LargeInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
    };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits: number[], base?: number, isNegative?: boolean) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();
