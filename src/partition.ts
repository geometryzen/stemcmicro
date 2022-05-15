import { ExtensionEnv } from './env/ExtensionEnv';
import { one } from './tree/rat/Rat';
import { cdr, is_cons, U } from './tree/tree';

/*
 Partition a term

  Input:
    p1: term (factor or product of factors)
    p2: free variable

  Output:
    constant expression
    variable expression
*/
export function partition(p1: U, p2: U, $: ExtensionEnv): [U, U] {
    let p3: U = one;
    let p4: U = p3;

    p1 = cdr(p1);
    if (!is_cons(p1)) {
        return [p3, p4];
    }
    for (const p of p1) {
        if (p.contains(p2)) {
            p4 = $.multiply(p4, p);
        }
        else {
            p3 = $.multiply(p3, p);
        }
    }
    return [p3, p4];
}
