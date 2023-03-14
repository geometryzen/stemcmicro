import { ExtensionEnv } from "../../env/ExtensionEnv";
import { isZeroLikeOrNonZeroLikeOrUndetermined } from "../../scripting/isZeroLikeOrNonZeroLikeOrUndetermined";
import { create_int, Rat } from "../../tree/rat/Rat";
import { Cons } from "../../tree/tree";

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

    const checkResult = isZeroLikeOrNonZeroLikeOrUndetermined(arg, $);

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
