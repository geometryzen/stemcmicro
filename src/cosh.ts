import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { ARCCOSH, COSH } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { wrap_as_flt } from './tree/flt/Flt';
import { is_flt } from './operators/flt/is_flt';
import { cadr } from './tree/helpers';
import { one } from './tree/rat/Rat';
import { car, U } from './tree/tree';

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
export function Eval_cosh(p1: U, $: ExtensionEnv): void {
    const result = ycosh($.valueOf(cadr(p1)), $);
    stack_push(result);
}

export function ycosh(p1: U, $: ExtensionEnv): U {
    if (car(p1) === ARCCOSH) {
        return cadr(p1);
    }
    if (is_flt(p1)) {
        let d = Math.cosh(p1.d);
        if (Math.abs(d) < 1e-10) {
            d = 0.0;
        }
        return wrap_as_flt(d);
    }
    if ($.isZero(p1)) {
        return one;
    }
    return makeList(COSH, p1);
}
