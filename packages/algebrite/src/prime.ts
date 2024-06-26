import { create_int, Rat } from "@stemcmicro/atoms";
import { num_to_number } from "@stemcmicro/helpers";
import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { MAXPRIMETAB, primetab } from "./runtime/constants";
import { halt } from "./runtime/defs";

//-----------------------------------------------------------------------------
//
//  Look up the nth prime
//
//  Input:    n (0 < n < 10001)
//
//  Output:    nth prime
//
//-----------------------------------------------------------------------------
export function eval_prime(primeExpr: Cons, $: ExtensionEnv): Rat {
    return prime($.valueOf(primeExpr.argList.head));
}

export function prime(p1: U): Rat {
    const n = num_to_number(p1);
    if (n < 1 || n > MAXPRIMETAB) {
        halt("prime: Argument out of range.");
    }
    const p = primetab[n - 1];
    return create_int(p);
}
