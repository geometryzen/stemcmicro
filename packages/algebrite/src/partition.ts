import { one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { multiply } from "@stemcmicro/helpers";
import { cdr, is_cons, U } from "@stemcmicro/tree";

/*
 Partition a term

  Input:
    p1: term (factor or product of factors)
    p2: free variable

  Output:
    constant expression
    variable expression
*/
/**
 * Partition a term into constant and variable expressions.
 * @param term the term (factor or product of factors)
 * @param X the free variable
 */
export function partition(term: U, X: U, $: Pick<ExprContext, "valueOf">): [k: U, v: U] {
    const p1 = cdr(term);
    if (is_cons(p1)) {
        let k: U = one;
        let v: U = k;
        for (const p of p1) {
            if (p.contains(X)) {
                v = multiply($, v, p);
            } else {
                k = multiply($, k, p);
            }
        }
        return [k, v];
    } else {
        return [one, one];
    }
}
