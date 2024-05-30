import { BigInteger } from "@stemcmicro/atoms";
import { BASE, DEFAULT_ALPHABET, isPrecise, truncate } from "./big-helpers";

export { BigInteger };

const powersOfTwo = [1];
while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);

const LOBMASK_I = 1 << 30;

function roughLOB(n: BigInteger) {
    // get lowestOneBit (rough)
    if (n instanceof BigInteger) {
        const x = n.value | BigInt(LOBMASK_I);
        return x & -x;
    } else {
        throw new Error();
    }
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

export function gcd(a: number | BigInteger, b: number | BigInteger): BigInteger {
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
            t = b;
            b = a;
            a = t;
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

const parseBase = function (input: unknown, radix: number, alphabet: string | undefined, caseSensitive?: boolean) {
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
        } else throw new Error(c + " is not a valid character");
    }
    return parseBaseFromArray(digits, base, isNegative);
};

function parseBaseFromArray(digits: BigInteger[], base: BigInteger, isNegative?: boolean): BigInteger {
    let val = cache[0] as BigInteger;
    let pow = cache[1] as BigInteger;
    for (let i = digits.length - 1; i >= 0; i--) {
        val = val.add(digits[i].multiply(pow));
        pow = pow.multiply(base);
    }
    return isNegative ? val.negate() : val;
}

function toBase(n: BigInteger, radix: number): { value: number[]; isNegative: boolean } {
    const base = bigInt(radix) as BigInteger;
    if (base.isZero()) {
        if (n.isZero()) return { value: [0], isNegative: false };
        throw new Error("Cannot convert nonzero numbers to base 0.");
    }
    if (base.equals(-1)) {
        if (n.isZero()) return { value: [0], isNegative: false };
        // Creating a variable for the returned value as a means to bypass the type error...
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const values = [] as any[];
        if (n.isNegative()) {
            return {
                // eslint-disable-next-line prefer-spread
                value: values.concat.apply([], Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])),
                isNegative: false
            };
        }
        // eslint-disable-next-line prefer-spread
        const arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
        arr.unshift([1]);
        return {
            // eslint-disable-next-line prefer-spread
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value: values.concat.apply([], arr),
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
            // eslint-disable-next-line prefer-spread
            value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
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

function parseStringValue(v: string): BigInteger {
    if (isPrecise(+v)) {
        const x = +v;
        if (x === truncate(x)) {
            return new BigInteger(BigInt(x));
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
        text += new Array(exp + 1).join("0");
        v = text;
    }
    const isValid = /^([0-9][0-9]*)$/.test(v);
    if (!isValid) throw new Error("Invalid integer: " + v);
    return new BigInteger(BigInt(sign ? "-" + v : v));
}

function parseNumberValue(v: number): BigInteger {
    return new BigInteger(BigInt(v));
}

function parseValue(v: number | string | bigint | BigInteger): BigInteger {
    if (typeof v === "number") {
        return parseNumberValue(v);
    }
    if (typeof v === "string") {
        return parseStringValue(v);
    }
    if (typeof v === "bigint") {
        return new BigInteger(v);
    }
    return v;
}

const cache: BigInteger[] = [];
/**
 * This is (also) the constructor function.
 * @param v
 * @param radix
 * @param alphabet
 * @param caseSensitive
 * @returns
 */
function Integer(v?: number | string | bigint | BigInteger, radix?: number, alphabet?: string, caseSensitive?: boolean): BigInteger {
    if (typeof v === "undefined") return cache[0];
    if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
    return parseValue(v);
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
    return x instanceof BigInteger;
};
Integer.randBetween = randBetween;

Integer.fromArray = function (digits: number[], base?: number, isNegative?: boolean) {
    return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
};

export const bigInt = (function (/*undefined*/) {
    return Integer;
})();
