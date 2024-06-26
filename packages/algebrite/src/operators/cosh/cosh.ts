import { create_flt, is_flt, one } from "@stemcmicro/atoms";
import { cadr, car, Cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { ARCCOSH, COSH } from "../../runtime/constants";

/* cosh =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the hyperbolic cosine of x

```
            exp(x) + exp(-x)
  cosh(x) = ----------------
                   2
```

*/
export function eval_cosh(expr: Cons, $: ExtensionEnv): U {
    return ycosh($.valueOf(cadr(expr)), $);
}

export function ycosh(p1: U, $: ExtensionEnv): U {
    if (car(p1).equals(ARCCOSH)) {
        return cadr(p1);
    }
    if (is_flt(p1)) {
        let d = Math.cosh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return create_flt(d);
    }
    if ($.iszero(p1)) {
        return one;
    }
    return items_to_cons(COSH, p1);
}
