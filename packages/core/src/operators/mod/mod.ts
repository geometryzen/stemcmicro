import { bigInt, create_int, is_flt, is_num, Rat } from "@stemcmicro/atoms";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { num_to_number } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { is_rat_and_integer } from "@stemcmicro/predicates";
import { Cons, items_to_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { mmod } from "../../mmul";
import { halt } from "../../runtime/defs";
import { caddr, cadr } from "../../tree/helpers";

const MOD = native_sym(Native.mod);

export function eval_mod(p1: Cons, $: ExtensionEnv): U {
    const arg2 = $.valueOf(caddr(p1));
    const arg1 = $.valueOf(cadr(p1));
    return mod(arg1, arg2, $);
}

function mod(a: U, b: U, $: ExtensionEnv): U {
    if ($.iszero(b)) {
        return diagnostic(Diagnostics.Division_by_zero);
    }

    if (!is_num(a) || !is_num(b)) {
        return items_to_cons(MOD, a, b);
    }

    if (is_flt(a)) {
        const n = num_to_number(a);
        if (isNaN(n)) {
            halt("mod function: cannot convert float value to integer");
        }
        a = create_int(n);
    }

    if (is_flt(b)) {
        const n = num_to_number(b);
        if (isNaN(n)) {
            halt("mod function: cannot convert float value to integer");
        }
        b = create_int(n);
    }

    if (!is_rat_and_integer(a) || !is_rat_and_integer(b)) {
        halt("mod function: integer arguments expected");
    }

    // return a.mod(b)

    return new Rat(mmod(a.a, b.a), bigInt.one);
}
