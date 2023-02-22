import { ExtensionEnv } from '../../env/ExtensionEnv';
import { halt } from '../../runtime/defs';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { caddddr, cadddr, caddr, cadr } from '../../tree/helpers';
import { wrap_as_int } from '../../tree/rat/Rat';
import { NIL, U } from '../../tree/tree';
import { is_sym } from '../sym/is_sym';

// 'for' function

/*
x=0
y=2
for(do(x=sqrt(2+x),y=2*y/x),k,1,9)
float(y)

X: k
B: 1...9

1st parameter is the body
2nd parameter is the variable to loop with
3rd and 4th are the limits

*/

// define A p3
// define B p4
// define I p5
// define X p6
export function Eval_for(p1: U, $: ExtensionEnv): U {
    const loopingVariable = caddr(p1);
    if (!is_sym(loopingVariable)) {
        halt('for: 2nd arg should be the variable to loop over');
    }

    const j = evaluate_integer(cadddr(p1), $);
    if (isNaN(j)) {
        return p1;
    }

    const k = evaluate_integer(caddddr(p1), $);
    if (isNaN(k)) {
        return p1;
    }

    // remember contents of the index
    // variable so we can put it back after the loop
    const p4: U = $.getBinding(loopingVariable);
    try {
        for (let i = j; i <= k; i++) {
            $.setBinding(loopingVariable, wrap_as_int(i));
            $.valueOf(cadr(p1));
        }
    }
    finally {
        // put back the index variable to original content
        $.setBinding(loopingVariable, p4);
    }

    // return value
    return NIL;
}
