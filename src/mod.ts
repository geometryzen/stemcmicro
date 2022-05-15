import bigInt from 'big-integer';
import { ExtensionEnv } from './env/ExtensionEnv';
import { is_rat_integer } from './is_rat_integer';
import { makeList } from './makeList';
import { mmod } from './mmul';
import { nativeInt } from './nativeInt';
import { is_num } from './predicates/is_num';
import { MOD } from './runtime/constants';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { is_flt } from './tree/flt/is_flt';
import { caddr, cadr } from './tree/helpers';
import { integer, Rat } from './tree/rat/Rat';
import { U } from './tree/tree';

export function Eval_mod(p1: U, $: ExtensionEnv): void {
    const arg2 = $.valueOf(caddr(p1));
    const arg1 = $.valueOf(cadr(p1));
    stack_push(mod(arg1, arg2, $));
}

function mod(p1: U, p2: U, $: ExtensionEnv): U {
    if ($.isZero(p2)) {
        throw new Error('mod function: divide by zero');
    }

    if (!is_num(p1) || !is_num(p2)) {
        return makeList(MOD, p1, p2);
    }

    if (is_flt(p1)) {
        const n = nativeInt(p1);
        if (isNaN(n)) {
            halt('mod function: cannot convert float value to integer');
        }
        p1 = integer(n);
    }

    if (is_flt(p2)) {
        const n = nativeInt(p2);
        if (isNaN(n)) {
            halt('mod function: cannot convert float value to integer');
        }
        p2 = integer(n);
    }

    if (!is_rat_integer(p1) || !is_rat_integer(p2)) {
        halt('mod function: integer arguments expected');
    }

    return new Rat(mmod(p1.a, p2.a), bigInt.one);
}
