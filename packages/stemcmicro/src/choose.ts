import { compare_num_num } from "./calculators/compare/compare_num_num";
import { divide } from "./helpers/divide";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { factorial } from "./operators/factorial/factorial";
import { is_num } from "./operators/num/is_num";
import { cadr } from "./tree/helpers";
import { zero } from "./tree/rat/Rat";
import { car, Cons, U } from "./tree/tree";

/* choose =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
n,k

General description
-------------------

Returns the number of combinations of n items taken k at a time.

For example, the number of five card hands is choose(52,5)

```
                          n!
      choose(n,k) = -------------
                     k! (n - k)!
```
*/
export function eval_choose(expr: Cons, $: ExtensionEnv): U {
    const cdr_expr = expr.cdr;
    const N = $.valueOf(car(cdr_expr));
    // console.lg(`N => ${$.toListString(N)}`);
    const K = $.valueOf(cadr(cdr_expr));
    // console.lg(`K => ${$.toListString(K)}`);
    const result = choose(N, K, $);
    return result;
}

function choose(N: U, K: U, $: ExtensionEnv): U {
    // console.lg(`choose(N = ${$.toListString(N)}, K = ${$.toListString(N)})`);

    if (!choose_check_args(N, K)) {
        return zero;
    }
    return divide(divide(factorial(N), factorial(K), $), factorial($.subtract(N, K)), $);
}

// Result vanishes for k < 0 or k > n. (A=B, p. 19)
function choose_check_args(N: U, K: U): boolean {
    if (is_num(N) && compare_num_num(N, zero) < 0) {
        return false;
    } else if (is_num(K) && compare_num_num(K, zero) < 0) {
        return false;
    } else if (is_num(N) && is_num(K) && compare_num_num(N, K) < 0) {
        return false;
    } else {
        return true;
    }
}
