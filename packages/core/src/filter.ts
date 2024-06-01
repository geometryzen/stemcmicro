import { is_tensor, Tensor, zero } from "@stemcmicro/atoms";
import { car, cdr, Cons, is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { is_add } from "./runtime/helpers";

/*
Remove terms that involve a given symbol or expression. For example...

  filter(x^2 + x + 1, x)    =>  1

  filter(x^2 + x + 1, x^2)  =>  x + 1
*/
export function eval_filter(p1: Cons, $: Pick<ExtensionEnv, "add" | "valueOf">): U {
    p1 = cdr(p1);
    let result = $.valueOf(car(p1));

    if (is_cons(p1)) {
        result = p1.tail().reduce((acc: U, p: U) => filter(acc, $.valueOf(p), $), result);
    }
    return result;
}

/**
 * Filter out terms in the polynomial f that contain x.
 * In other words, return only the constant part of f when x is the variable.
 * @param F The polynomial.
 * @param X The variable.
 */
export function filter(F: U, X: U, $: Pick<ExtensionEnv, "add">): U {
    return filter_main(F, X, $);
}

function filter_main(F: U, X: U, $: Pick<ExtensionEnv, "add">): U {
    if (is_add(F)) {
        return filter_sum(F, X, $);
    }

    if (is_tensor(F)) {
        return filter_tensor(F, X, $);
    }

    if (F.contains(X)) {
        return zero;
    }

    return F;
}

function filter_sum(F: Cons, X: U, $: Pick<ExtensionEnv, "add">): U {
    return F.tail().reduce((a: U, b: U) => $.add(a, filter(b, X, $)), zero);
}

function filter_tensor(F: Tensor, X: U, $: Pick<ExtensionEnv, "add">): U {
    return F.map((f) => filter(f, X, $));
}
