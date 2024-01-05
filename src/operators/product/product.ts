import { ExtensionEnv } from '../../env/ExtensionEnv';
import { halt } from '../../runtime/defs';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { caddddr, cadddr, caddr, cadr } from '../../tree/helpers';
import { create_int, one } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';
import { is_sym } from '../sym/is_sym';

/**
 * product(body:U, index:Sym, lower:Num, upper:Num): U
 */
export function Eval_product(expr: U, $: ExtensionEnv): U {
    // 1st arg
    const body = cadr(expr);

    // 2nd arg (index)
    const indexVariable = caddr(expr);
    if (!is_sym(indexVariable)) {
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
    const oldIndexVariableValue = $.getSymbolBinding(indexVariable);

    let temp: U = one;

    for (let i = j; i <= k; i++) {
        $.setSymbolBinding(indexVariable, create_int(i));
        const arg2 = $.valueOf(body);
        temp = $.multiply(temp, arg2);
    }

    // put back the index variable to original content
    $.setSymbolBinding(indexVariable, oldIndexVariableValue);

    return temp;
}
