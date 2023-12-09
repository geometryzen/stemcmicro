import {
    BASE,
    DEFAULT_ALPHABET,
    isPrecise,
    truncate
} from './big-helpers';

export interface BigInteger {
    abs(): BigInteger;
    add(rhs: number | string | BigInteger): BigInteger;
    and(rhs: string): BigInteger;
    bitLength(): BigInteger;
    compare(rhs: number | BigInteger): 1 | 0 | -1;
    compareAbs(rhs: number | string): 1 | 0 | -1;
    compareTo(rhs: BigInteger): 1 | 0 | -1;
    multiply(rhs: number | string | BigInteger): BigInteger;
    divide(rhs: number | string | BigInteger): BigInteger;
    eq(n: number | string | BigInteger): boolean;
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
    not(): BigInteger;
    notEquals(n: number | string | BigInteger): boolean;
    or(rhs: number | string): BigInteger;
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
    xor(rhs: number | string): BigInteger;
}

const cache: BigInteger[] = [];

export const bigInt = (function (/*undefined*/) {

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
        and(n: number | string | BigInteger): BigInteger {
            return bitwise(this, n, function (a, b) {
                return a & b;
            });
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
        isDivisibleBy(v: number): boolean {
            const n = parseValue(v);
            if (n.isZero()) return false;
            if (n.isUnit()) return true;
            if (n.compareAbs(2) === 0) return this.isEven();
            return this.mod(n).isZero();
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
        isPrime(strict: boolean): boolean {
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
        isProbablePrime(iterations: number, rng: () => number) {
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
        modInv(n: number): BigInteger {
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
        }
        modPow(exp, mod) {
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
        }
        next() {
            return new NativeBigInt(this.value + BigInt(1));
        }
        not(): NativeBigInt {
            return this.negate().prev();
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
        shiftLeft(v: number | string | BigInteger): BigInteger {
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
        }
        shiftRight(v: number | string | BigInteger): BigInteger {
            let remQuo;
            let n = parseValue(v).toJSNumber();
            if (!shift_isSmall(n)) {
                throw new Error(String(n) + " is too large for shifting.");
            }
            if (n < 0) return this.shiftLeft(-n);
            let result = this;
            while (n >= powers2Length) {
                if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
                remQuo = divModAny(result, highestPower2);
                result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
                n -= powers2Length - 1;
            }
            remQuo = divModAny(result, powersOfTwo[n]);
            return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
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
        equals(v) {
            return this.compare(v) === 0;
        }
        eq(v) {
            return this.equals(v);
        }
        notEquals(v) {
            return this.compare(v) !== 0;
        }
        neq(v) {
            return this.notEquals(v);
        }
        greater(v) {
            return this.compare(v) > 0;
        }
        gt(v) {
            return this.greater(v);
        }
        lesser(v) {
            return this.compare(v) < 0;
        }
        lt(v) {
            return this.lesser(v);
        }

        greaterOrEquals(v) {
            return this.compare(v) >= 0;
        }
        geq(v) {
            return this.greaterOrEquals(v);
        }

        lesserOrEquals(v) {
            return this.compare(v) <= 0;
        }
        leq(v) {
            return this.lesserOrEquals(v);
        }
        or(n) {
            return bitwise(this, n, function (a, b) { return a | b; });
        }
        xor(n) {
            return bitwise(this, n, function (a, b) { return a ^ b; });
        }
        toArray(radix) {
            return toBase(this, radix);
        }
        toJSON() {
            return this.toString();
        }
        valueOf() {
            return parseInt(this.toString(), 10);
        }
        toJSNumber() {
            return parseInt(this.toString(), 10);
        }
    }

    function divModAny(self: BigInteger, v: BigInteger) {
        const n = parseValue(v);
        return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
    }

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

    const powersOfTwo = [1];
    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    const powers2Length = powersOfTwo.length;
    const highestPower2 = powersOfTwo[powers2Length - 1];

    function shift_isSmall(n: number): boolean {
        return Math.abs(n) <= BASE;
    }

    function bitwise(x: BigInteger, y: BigInteger, fn: (a: number, b: number) => number): BigInteger {
        y = parseValue(y);
        const xSign = x.isNegative();
        const ySign = y.isNegative();
        let xRem = xSign ? x.not() : x;
        let yRem = ySign ? y.not() : y;
        let xDigit = 0;
        let yDigit = 0;
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

    const LOBMASK_I = 1 << 30;

    function roughLOB(n: BigInteger) { // get lowestOneBit (rough)
        if (n instanceof NativeBigInt) {
            const x = n.value | BigInt(LOBMASK_I);
            return x & -x;
        }
        else {
            throw new Error();
        }
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


    function max(a: number | bigint | BigInteger, b: number | bigint | BigInteger): BigInteger {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
    }
    function min(a: number | bigint | BigInteger, b: number | bigint | BigInteger): BigInteger {
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

    function randBetween(a: number | string | BigInteger, b: number | string | BigInteger, rng?: () => number) {
        const iA = parseValue(a);
        const iB = parseValue(b);
        const usedRNG = rng || Math.random;
        const low = min(iA, iB);
        const high = max(iA, iB);
        const range = high.subtract(low).add(1);
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
        const digits: BigInteger[] = [];
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

    function parseBaseFromArray(digits: BigInteger[], base: BigInteger, isNegative: boolean): BigInteger {
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

    function parseStringValue(v: string): NativeBigInt {
        if (isPrecise(+v)) {
            const x = +v;
            if (x === truncate(x)) {
                return new NativeBigInt(BigInt(x));
            }
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
        return new NativeBigInt(BigInt(sign ? "-" + v : v));
    }

    function parseNumberValue(v: number): NativeBigInt {
        return new NativeBigInt(BigInt(v));
    }

    function parseValue(v: number | string | bigint | NativeBigInt): NativeBigInt {
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
        return x instanceof NativeBigInt;
    };
    Integer.randBetween = randBetween;

    Integer.fromArray = function (digits: number[], base?: number, isNegative?: boolean) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
    };

    return Integer;
})();
