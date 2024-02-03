import { ExtensionEnv } from "../env/ExtensionEnv";
import { is_flt } from "../operators/flt/is_flt";
import { is_num } from "../operators/num/is_num";
import { is_rat } from "../operators/rat/is_rat";
import { MATH_POW } from "../runtime/ns_math";
import { Num } from "../tree/num/Num";
import { negOne } from "../tree/rat/Rat";
import { items_to_cons, U } from "../tree/tree";

/**
 * TODO: Exactly what kind of inverse is this?
 * @param expr 
 * @param $ 
 * @returns 
 */
export function inverse(expr: U, $: Pick<ExtensionEnv, 'valueOf'>): U {
    const value = $.valueOf(expr);
    if (is_num(value)) {
        return invert_number(value);
    }
    else {
        return $.valueOf(items_to_cons(MATH_POW, value, negOne));
    }
}

/**
 *
 */
export function invert_number(num: Num): Num {
    if (num.isZero()) {
        // TODO: This error could/should be part of the inv() methods?
        throw new Error('divide by zero');
    }

    if (is_flt(num)) {
        return num.inv();
    }

    if (is_rat(num)) {
        return num.inv();
    }

    throw new Error();
}

