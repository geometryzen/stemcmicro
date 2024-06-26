import { bigInt, BigInteger, negOne, Rat } from "@stemcmicro/atoms";
import { cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { mint, setSignTo } from "./bignum";
import { mgcd } from "./mgcd";
import { mdiv, mdivrem, mmod, mmul } from "./mmul";
import { MULTIPLY, POWER, primetab } from "./runtime/constants";

// Factor using the Pollard rho method

let n_factor_number = bigInt(0);

export function factor_rat(q: Rat): U {
    if (q.isZero() || q.isOne() || q.isMinusOne()) {
        return q;
    }
    n_factor_number = q.a;

    const factors = factor_a();
    if (factors.length === 0) {
        //
    }
    if (factors.length === 1) {
        return factors[0];
    }
    if (factors.length > 1) {
        return cons(MULTIPLY, items_to_cons(...factors));
    }
    return nil;
}

// factor using table look-up, then switch to rho method if necessary
// From TAOCP Vol. 2 by Knuth, p. 380 (Algorithm A)
function factor_a(): U[] {
    const result: U[] = [];

    if (n_factor_number.isNegative()) {
        n_factor_number = setSignTo(n_factor_number, 1);
        result.push(negOne);
    }

    for (let k = 0; k < 10000; k++) {
        result.push(...try_kth_prime(k));
        // if n_factor_number is 1 then we're done
        if (n_factor_number.compare(1) === 0) {
            return result;
        }
    }

    result.push(...factor_b());
    return result;
}

function try_kth_prime(k: number): U[] {
    const result: U[] = [];
    let q: BigInteger;

    const d = mint(primetab[k]);

    let count = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // if n_factor_number is 1 then we're done
        if (n_factor_number.compare(1) === 0) {
            if (count) {
                result.push(_factor(d, count));
            }
            return result;
        }

        let r: BigInteger;
        [q, r] = Array.from(mdivrem(n_factor_number, d));

        // continue looping while remainder is zero
        if (r.isZero()) {
            count++;
            n_factor_number = q;
        } else {
            break;
        }
    }

    if (count) {
        result.push(_factor(d, count));
    }

    // q = n_factor_number/d, hence if q < d then
    // n_factor_number < d^2 so n_factor_number is prime
    if (q.compare(d) === -1) {
        result.push(_factor(n_factor_number, 1));
        n_factor_number = mint(1);
    }
    return result;
}

// From TAOCP Vol. 2 by Knuth, p. 385 (Algorithm B)
function factor_b(): U[] {
    const result: U[] = [];
    const bigint_one = mint(1);
    let x = mint(5);
    let xprime = mint(2);

    let k = 1;
    let l = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (n_factor_number.isProbablePrime()) {
            result.push(_factor(n_factor_number, 1));
            return result;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            // g = gcd(x' - x, n_factor_number)
            let t = xprime.subtract(x);
            t = setSignTo(t, 1);
            const g = mgcd(t, n_factor_number);

            if (g.equals(1)) {
                if (--k === 0) {
                    xprime = x;
                    l *= 2;
                    k = l;
                }

                // x = (x ^ 2 + 1) mod n_factor_number
                t = mmul(x, x);
                x = t.add(bigint_one);
                t = mmod(x, n_factor_number);
                x = t;

                continue;
            }

            result.push(_factor(g, 1));

            if (g.compare(n_factor_number) === 0) {
                return result;
            }

            // n_factor_number = n_factor_number / g
            t = mdiv(n_factor_number, g);
            n_factor_number = t;

            // x = x mod n_factor_number
            t = mmod(x, n_factor_number);
            x = t;

            // xprime = xprime mod n_factor_number
            t = mmod(xprime, n_factor_number);
            xprime = t;

            break;
        }
    }
}

function _factor(d: BigInteger, count: number): U {
    let factor: U = new Rat(d, bigInt.one);
    if (count > 1) {
        factor = items_to_cons(POWER, factor, new Rat(mint(count), bigInt.one));
    }
    return factor;
}
