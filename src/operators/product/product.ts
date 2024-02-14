import { create_int, is_sym, one } from 'math-expression-atoms';
import { Cons, nil, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { halt } from '../../runtime/defs';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { caddddr, cadddr, caddr, cadr } from '../../tree/helpers';

/**
 * product(body:U, index:Sym, lower:Num, upper:Num): U
 */
export function eval_product(expr: Cons, $: ExtensionEnv): U {
    // 1st arg
    const body = cadr(expr);

    // 2nd arg (index)
    const index = caddr(expr);
    if (!is_sym(index)) {
        halt('product: 2nd arg?');
    }

    // 3rd arg (lower limit)
    const j = evaluate_integer(cadddr(expr), $);
    if (isNaN(j)) {
        return expr;
    }

    // 4th arg (upper limit)
    const k = evaluate_integer(caddddr(expr), $);
    if (isNaN(k)) {
        return expr;
    }

    // remember contents of the index
    // variable so we can put it back after the loop
    const prev_index = $.getBinding(index, nil);
    try {
        let temp: U = one;

        for (let i = j; i <= k; i++) {
            $.setBinding(index, create_int(i));
            const arg2 = $.valueOf(body);
            temp = $.multiply(temp, arg2);
        }

        return temp;
    }
    finally {
        // put back the index variable to original content
        $.setBinding(index, prev_index);
    }
}
