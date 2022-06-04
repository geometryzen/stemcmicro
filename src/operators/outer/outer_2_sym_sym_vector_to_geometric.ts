
import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross($: ExtensionEnv) {
    return function (a: Sym, b: Sym): boolean {
        return $.treatAsVector(a) && $.treatAsVector(b) && compare_sym_sym(a, b) < 0;
    };
}

/**
 * a ^ b => 1/2 * (ab - ba)
 */
class Op extends Function2X<Sym, Sym> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('outer_2_sym_sym_vector_to_geometric', MATH_OUTER, is_sym, is_sym, cross($), $);
    }
    transform2(opr: Sym, a: Sym, b: Sym): [TFLAGS, U] {
        const $ = this.$;
        const ab = items_to_cons(MATH_MUL, a, b);
        const ba = items_to_cons(MATH_MUL, b, a);
        const abba = $.subtract(ab, ba);
        const retval = $.multiply(half, abba);
        return [TFLAG_DIFF, retval];
    }
}

export const outer_2_sym_sym_vector_to_geometric = new Builder();
