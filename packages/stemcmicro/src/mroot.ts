import { mint } from "./bignum";
import { mpow } from "./mpow";
import { halt } from "./runtime/defs";
import { mcmp } from "./runtime/mcmp";
import { bigInt, BigInteger } from "./tree/rat/big-integer";

//-----------------------------------------------------------------------------
//
//  Bignum root
//
//  Returns null pointer if not perfect root.
//
//  The sign of the radicand is ignored.
//
//-----------------------------------------------------------------------------
export function mroot(n: BigInteger, index: number) {
    n = n.abs();

    if (index === 0) {
        halt("root index is zero");
    }

    // count number of bits
    let k = 0;
    while (n.shiftRight(k).toJSNumber() > 0) {
        k++;
    }

    if (k === 0) {
        return mint(0);
    }

    // initial guess
    k = Math.floor((k - 1) / index);

    const j = Math.floor(k / 32 + 1);
    let x = bigInt(j);

    for (let i = 0; i < j; i++) {
        // zero-out the ith bit
        x = x.and(bigInt(1).shiftLeft(i).not());
    }

    while (k >= 0) {
        // set the kth bit
        x = x.or(bigInt(1).shiftLeft(k));

        const y = mpow(x, index);
        switch (mcmp(y, n)) {
            case 0:
                return x;
            case 1:
                //mp_clr_bit(x, k)
                // clear the kth bit
                x = x.and(bigInt(1).shiftLeft(k).not());
                break;
        }
        k--;
    }

    return 0;
}

//if SELFTEST
