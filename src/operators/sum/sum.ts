import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_sym } from '../sym/is_sym';
import { halt } from '../../runtime/defs';
import { evaluate_integer } from '../../scripting/evaluate_integer';
import { caddddr, cadddr, caddr, cadr } from '../../tree/helpers';
import { create_int, zero } from '../../tree/rat/Rat';
import { U } from '../../tree/tree';

// 'sum' function

//define A p3u
//define B p4
//define I p5
//define X p6

// leaves the sum at the top of the stack
export function Eval_sum(arg: U, $: ExtensionEnv): U {
    const result = _sum(arg, $);
    return result;
}

function _sum(p1: U, $: ExtensionEnv): U {
    // 1st arg
    const body = cadr(p1);

    // 2nd arg (index)
    const index = caddr(p1);
    if (!is_sym(index)) {
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
    const original = $.getSymbolValue(index);
    let temp: U = zero;
    try {
        for (let i = j; i <= k; i++) {
            $.setSymbolValue(index, create_int(i));
            temp = $.add(temp, $.valueOf(body));
        }
    }
    finally {
        $.setSymbolValue(index, original);
    }


    // put back the index variable to original content
    return temp;
}
