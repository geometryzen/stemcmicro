
export const BASE = 1e7;
export const LOG_BASE = 7;
export const MAX_INT = 9007199254740992;
export const MAX_INT_ARR = smallToArray(MAX_INT);
export const DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

export function isPrecise(n: number): boolean {
    return -MAX_INT < n && n < MAX_INT;
}

export function smallToArray(n: number): number[] { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
    if (n < 1e7) {
        return [n];
    }
    if (n < 1e14) {
        return [n % 1e7, Math.floor(n / 1e7)];
    }
    return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
}

export function compareAbs(a: number[], b: number[]): 1 | 0 | -1 {
    if (a.length !== b.length) {
        return a.length > b.length ? 1 : -1;
    }
    for (let i = a.length - 1; i >= 0; i--) {
        if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
    }
    return 0;
}

export function arrayToSmall(arr: number[]): number | number[] { // If BASE changes this function may need to change
    trim(arr);
    const length = arr.length;
    if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
        switch (length) {
            case 0: return 0;
            case 1: return arr[0];
            case 2: return arr[0] + arr[1] * BASE;
            default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
        }
    }
    return arr;
}

export function trim(v: number[]): void {
    let i = v.length;
    while (v[--i] === 0);
    v.length = i + 1;
}

export function createArray(length: number): number[] { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
    const x = new Array<number>(length);
    let i = -1;
    while (++i < length) {
        x[i] = 0;
    }
    return x;
}

export function truncate(n: number): number {
    if (n > 0) return Math.floor(n);
    return Math.ceil(n);
}

function add(a: number[], b: number[]): number[] { // assumes a and b are arrays with a.length >= b.length
    const l_a = a.length;
    const l_b = b.length;
    const r = new Array<number>(l_a);
    let carry = 0;
    const base = BASE;
    let i: number;
    let sum: number;
    for (i = 0; i < l_b; i++) {
        sum = a[i] + b[i] + carry;
        carry = sum >= base ? 1 : 0;
        r[i] = sum - carry * base;
    }
    while (i < l_a) {
        sum = a[i] + carry;
        carry = sum === base ? 1 : 0;
        r[i++] = sum - carry * base;
    }
    if (carry > 0) r.push(carry);
    return r;
}

export function addAny(a: number[], b: number[]): number[] {
    if (a.length >= b.length) return add(a, b);
    return add(b, a);
}

export function addSmall(a: number[], carry: number): number[] { // assumes a is array, carry is number with 0 <= carry < MAX_INT
    const l = a.length;
    const r = new Array<number>(l);
    const base = BASE;
    let i: number;
    let sum: number;
    for (i = 0; i < l; i++) {
        sum = a[i] - base + carry;
        carry = Math.floor(sum / base);
        r[i] = sum - carry * base;
        carry += 1;
    }
    while (carry > 0) {
        r[i++] = carry % base;
        carry = Math.floor(carry / base);
    }
    return r;
}

export function subtract(a: number[], b: number[]) { // assumes a and b are arrays with a >= b
    const a_l = a.length;
    const b_l = b.length;
    const r = new Array<number>(a_l);
    let borrow = 0;
    const base = BASE;
    let difference: number;
    let i: number;
    for (i = 0; i < b_l; i++) {
        difference = a[i] - borrow - b[i];
        if (difference < 0) {
            difference += base;
            borrow = 1;
        }
        else borrow = 0;
        r[i] = difference;
    }
    for (i = b_l; i < a_l; i++) {
        difference = a[i] - borrow;
        if (difference < 0) difference += base;
        else {
            r[i++] = difference;
            break;
        }
        r[i] = difference;
    }
    for (; i < a_l; i++) {
        r[i] = a[i];
    }
    trim(r);
    return r;
}

export function multiplyLong(a: number[], b: number[]): number[] {
    const a_l = a.length;
    const b_l = b.length;
    const l = a_l + b_l;
    const r = createArray(l);
    const base = BASE;
    let product: number;
    let carry: number;
    let i: number;
    for (i = 0; i < a_l; ++i) {
        const a_i = a[i];
        for (let j = 0; j < b_l; ++j) {
            const b_j = b[j];
            product = a_i * b_j + r[i + j];
            carry = Math.floor(product / base);
            r[i + j] = product - carry * base;
            r[i + j + 1] += carry;
        }
    }
    trim(r);
    return r;
}

export function multiplySmall(a: number[], b: number) { // assumes a is array, b is number with |b| < BASE
    const l = a.length;
    const r = new Array<number>(l);
    const base = BASE;
    let carry = 0;
    let product: number;
    let i: number;
    for (i = 0; i < l; i++) {
        product = a[i] * b + carry;
        carry = Math.floor(product / base);
        r[i] = product - carry * base;
    }
    while (carry > 0) {
        r[i++] = carry % base;
        carry = Math.floor(carry / base);
    }
    return r;
}

export function shiftLeft(x: number[], n: number): number[] {
    const r: number[] = [];
    while (n-- > 0) r.push(0);
    return r.concat(x);
}

export function multiplyKaratsuba(x: number[], y: number[]): number[] {
    let n = Math.max(x.length, y.length);

    if (n <= 30) return multiplyLong(x, y);
    n = Math.ceil(n / 2);

    const b = x.slice(n);
    const a = x.slice(0, n);
    const d = y.slice(n);
    const c = y.slice(0, n);

    const ac = multiplyKaratsuba(a, c);
    const bd = multiplyKaratsuba(b, d);
    const abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

    const product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
    trim(product);
    return product;
}

// The following function is derived from a surface fit of a graph plotting the performance difference
// between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
export function useKaratsuba(l1: number, l2: number): boolean {
    return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
}

export function square(a: number[]) {
    //console.assert(2 * BASE * BASE < MAX_INT);
    const l = a.length;
    const r = createArray(l + l);
    const base = BASE;
    for (let i = 0; i < l; i++) {
        const a_i = a[i];
        let carry = 0 - a_i * a_i;
        for (let j = i; j < l; j++) {
            const a_j = a[j];
            const product = 2 * (a_i * a_j) + r[i + j] + carry;
            carry = Math.floor(product / base);
            r[i + j] = product - carry * base;
        }
        r[i + l] = carry;
    }
    trim(r);
    return r;
}
export function divMod1(a: number[], b: number[]) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
    const a_l = a.length;
    const b_l = b.length;
    const base = BASE;

    const result = createArray(b.length);
    let divisorMostSignificantDigit = b[b_l - 1];
    // normalization
    const lambda = Math.ceil(base / (2 * divisorMostSignificantDigit));
    const remainder = multiplySmall(a, lambda);
    const divisor = multiplySmall(b, lambda);
    let quotientDigit: number;
    let shift: number;
    let carry: number;
    let borrow: number;
    if (remainder.length <= a_l) remainder.push(0);
    divisor.push(0);
    divisorMostSignificantDigit = divisor[b_l - 1];
    for (shift = a_l - b_l; shift >= 0; shift--) {
        quotientDigit = base - 1;
        if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
            quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
        }
        // quotientDigit <= base - 1
        carry = 0;
        borrow = 0;
        const l = divisor.length;
        for (let i = 0; i < l; i++) {
            carry += quotientDigit * divisor[i];
            const q = Math.floor(carry / base);
            borrow += remainder[shift + i] - (carry - q * base);
            carry = q;
            if (borrow < 0) {
                remainder[shift + i] = borrow + base;
                borrow = -1;
            }
            else {
                remainder[shift + i] = borrow;
                borrow = 0;
            }
        }
        while (borrow !== 0) {
            quotientDigit -= 1;
            carry = 0;
            for (let i = 0; i < l; i++) {
                carry += remainder[shift + i] - base + divisor[i];
                if (carry < 0) {
                    remainder[shift + i] = carry + base;
                    carry = 0;
                }
                else {
                    remainder[shift + i] = carry;
                    carry = 1;
                }
            }
            borrow += carry;
        }
        result[shift] = quotientDigit;
    }
    // denormalization
    const rem = divModSmall(remainder, lambda)[0];
    return [arrayToSmall(result), arrayToSmall(rem)];
}

export function divMod2(a: number[], b: number[]) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
    // Performs faster than divMod1 on larger input sizes.
    let a_l = a.length;
    const b_l = b.length;
    const result: number[] = [];
    let part: number[] = [];
    const base = BASE;
    while (a_l) {
        part.unshift(a[--a_l]);
        trim(part);
        if (compareAbs(part, b) < 0) {
            result.push(0);
            continue;
        }
        const xlen = part.length;
        let highx = part[xlen - 1] * base + part[xlen - 2];
        const highy = b[b_l - 1] * base + b[b_l - 2];
        if (xlen > b_l) {
            highx = (highx + 1) * base;
        }
        let guess = Math.ceil(highx / highy);
        let check: number[];
        do {
            check = multiplySmall(b, guess);
            if (compareAbs(check, part) <= 0) break;
            guess--;
        } while (guess);
        result.push(guess);
        part = subtract(part, check);
    }
    result.reverse();
    return [arrayToSmall(result), arrayToSmall(part)];
}

function divModSmall(value: number[], lambda: number): [number[], number] {
    const length = value.length;
    const quotient = createArray(length);
    const base = BASE;
    let remainder = 0;
    for (let i = length - 1; i >= 0; --i) {
        const divisor = remainder * base + value[i];
        const q = truncate(divisor / lambda);
        remainder = divisor - q * lambda;
        quotient[i] = q | 0;
    }
    return [quotient, remainder | 0];
}
