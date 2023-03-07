import { ExtensionEnv } from '../../env/ExtensionEnv';
import { halt } from '../../runtime/defs';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { caddddr, cadddr, caddr, cadr } from '../../tree/helpers';
import { one, wrap_as_int } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';
import { is_sym } from '../sym/is_sym';

// 'product' function

//define A p3
//define B p4
//define I p5
//define X p6

// leaves the product at the top of the stack
export function Eval_product(p1: U, $: ExtensionEnv): U {
    // 1st arg
    const body = cadr(p1);

    // 2nd arg (index)
    const indexVariable = caddr(p1);
    if (!is_sym(indexVariable)) {
        halt('sum: 2nd arg?');
    }

    // 3rd arg (lower limit)
    const j = evaluate_integer(cadddr(p1), $);
    if (isNaN(j)) {
        return p1;
    }

    // 4th arg (upper limit)
    const k = evaluate_integer(caddddr(p1), $);
    if (isNaN(k)) {
        return p1;
    }

    // remember contents of the index
    // variable so we can put it back after the loop
    const oldIndexVariableValue = $.getSymbolValue(indexVariable);

    let temp: U = one;

    for (let i = j; i <= k; i++) {
        $.setSymbolValue(indexVariable, wrap_as_int(i));
        const arg2 = $.valueOf(body);
        temp = $.multiply(temp, arg2);
    }

    // put back the index variable to original content
    $.setSymbolValue(indexVariable, oldIndexVariableValue);

    return temp;
}
