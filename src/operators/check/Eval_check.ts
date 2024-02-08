import { create_int, Rat } from "math-expression-atoms";
import { Cons } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { isZeroLikeOrNonZeroLikeOrUndetermined } from "../../scripting/isZeroLikeOrNonZeroLikeOrUndetermined";
import { replace_assign_with_testeq } from "../predicate/replace_assign_with_testeq";

/* check =====================================================================
 
Tags
----
scripting, JS, internal, treenode, general concept
 
Parameters
----------
p
 
General description
-------------------
Returns whether the predicate p is true/false or unknown:
0 if false, 1 if true or remains unevaluated if unknown.
Note that if "check" is passed an assignment, it turns it into a test,
i.e. check(a = b) is turned into check(a==b) 
so "a" is not assigned anything.
Like in many programming languages, "check" also gives truthyness/falsyness
for numeric values. In which case, "true" is returned for non-zero values.
Potential improvements: "check" can't evaluate strings yet.
 
*/
export function Eval_check(expr: Cons, $: ExtensionEnv): Rat | Cons {
    // Don't evaluate the arguments! We don't want assignment as a side effect.
    const arg = expr.argList.head;
    const value = $.valueOf(replace_assign_with_testeq(arg));
    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(value, $);

    if (typeof checkResult === 'boolean') {
        // returned JavaScript true or false -> 1 or 0
        // TODO: More natural to return Bool. Should we make this configurable.
        // e.g. $.getDirective(Directive.useIntegerForBoolean)
        return create_int(Number(checkResult));
    }
    else if (checkResult) {
        throw new Error();
    }
    else {
        // returned null: unknown result
        // leave the whole check unevalled
        return expr;
    }
}
