import { divide, guess } from "@stemcmicro/helpers";
import { caddr, cadr, Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { filter } from "./filter";
import { degree } from "./operators/degree/degree";

/*
 Return the leading coefficient of a polynomial.

Example

  leading(5x^2+x+1,x)

Result

  5

The result is undefined if P is not a polynomial.
*/
export function eval_leading(arg: Cons, $: Pick<ExtensionEnv, "add" | "getDirective" | "multiply" | "power" | "valueOf">): U {
    const P = $.valueOf(cadr(arg));
    const V = $.valueOf(caddr(arg));
    const X = V.isnil ? guess(P) : V;
    return leading(P, X, $);
}

function leading(P: U, X: U, $: Pick<ExtensionEnv, "add" | "getDirective" | "multiply" | "power" | "valueOf">) {
    // N = degree of P
    const N = degree(P, X);

    // divide through by X ^ N, remove terms that depend on X
    return filter(divide(P, $.power(X, N), $), X, $);
}
