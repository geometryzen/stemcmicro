import { U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { filter } from "./filter";
import { guess } from "./guess";
import { divide } from "./helpers/divide";
import { degree } from "./operators/degree/degree";
import { caddr, cadr } from "./tree/helpers";

/*
 Return the leading coefficient of a polynomial.

Example

  leading(5x^2+x+1,x)

Result

  5

The result is undefined if P is not a polynomial.
*/
export function eval_leading(p1: U, $: Pick<ExtensionEnv, "add" | "multiply" | "power" | "valueOf">): U {
    const P = $.valueOf(cadr(p1));
    p1 = $.valueOf(caddr(p1));
    const X = p1.isnil ? guess(P) : p1;
    return leading(P, X, $);
}

function leading(P: U, X: U, $: Pick<ExtensionEnv, "add" | "multiply" | "power" | "valueOf">) {
    // N = degree of P
    const N = degree(P, X);

    // divide through by X ^ N, remove terms that depend on X
    return filter(divide(P, $.power(X, N), $), X, $);
}
