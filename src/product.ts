import { ExtensionEnv } from './env/ExtensionEnv';
import { is_sym } from './operators/sym/is_sym';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { evaluate_integer } from './scripting/evaluate_integer';
import { caddddr, cadddr, caddr, cadr } from './tree/helpers';
import { integer, one } from './tree/rat/Rat';
import { U } from './tree/tree';

// 'product' function

//define A p3
//define B p4
//define I p5
//define X p6

// leaves the product at the top of the stack
export function Eval_product(p1: U, $: ExtensionEnv): void {
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
        stack_push(p1);
        return;
    }

    // 4th arg (upper limit)
    const k = evaluate_integer(caddddr(p1), $);
    if (isNaN(k)) {
        stack_push(p1);
        return;
    }

    // remember contents of the index
    // variable so we can put it back after the loop
    const oldIndexVariableValue = $.getBinding(indexVariable);

    let temp: U = one;

    for (let i = j; i <= k; i++) {
        $.setBinding(indexVariable, integer(i));
        const arg2 = $.valueOf(body);
        temp = $.multiply(temp, arg2);
    }
    stack_push(temp);

    // put back the index variable to original content
    $.setBinding(indexVariable, oldIndexVariableValue);
}
