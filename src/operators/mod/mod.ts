import bigInt from 'big-integer';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { is_rat_and_integer } from '../../is_rat_and_integer';
import { mmod } from '../../mmul';
import { Native } from '../../native/Native';
import { native_sym } from '../../native/native_sym';
import { nativeInt } from '../../nativeInt';
import { halt } from '../../runtime/defs';
import { caddr, cadr } from '../../tree/helpers';
import { create_int, Rat } from '../../tree/rat/Rat';
import { Cons, items_to_cons, U } from '../../tree/tree';
import { is_flt } from '../flt/is_flt';
import { is_num } from '../num/is_num';

const MOD = native_sym(Native.mod);

export function Eval_mod(p1: Cons, $: ExtensionEnv): U {
    const arg2 = $.valueOf(caddr(p1));
    const arg1 = $.valueOf(cadr(p1));
    return mod(arg1, arg2, $);
}

function mod(a: U, b: U, $: ExtensionEnv): U {
    if ($.is_zero(b)) {
        halt('mod function: divide by zero');
    }

    if (!is_num(a) || !is_num(b)) {
        return items_to_cons(MOD, a, b);
    }

    if (is_flt(a)) {
        const n = nativeInt(a);
        if (isNaN(n)) {
            halt('mod function: cannot convert float value to integer');
        }
        a = create_int(n);
    }

    if (is_flt(b)) {
        const n = nativeInt(b);
        if (isNaN(n)) {
            halt('mod function: cannot convert float value to integer');
        }
        b = create_int(n);
    }

    if (!is_rat_and_integer(a) || !is_rat_and_integer(b)) {
        halt('mod function: integer arguments expected');
    }

    // return a.mod(b)

    return new Rat(mmod(a.a, b.a), bigInt.one);
}
