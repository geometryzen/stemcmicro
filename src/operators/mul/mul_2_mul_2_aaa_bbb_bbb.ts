import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_sym_sym } from "./is_mul_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, Sym, Sym>;
type RHS = Sym;
type EXPR = BCons<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const a = lhs.lhs;
    const b1 = lhs.rhs;
    const b2 = rhs;
    return b1.equals(b2) && !a.equals(b1);
}

/**
 * (a * b) * b => a * (b**2), but only if associating to the right.
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_aaa_bbb_bbb', MATH_MUL, and(is_cons, is_mul_2_sym_sym), is_sym, cross, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: LHS, rhs: Sym, expr: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocR(MATH_MUL)) {
            const a = $.valueOf(lhs.lhs);
            const b = $.valueOf(rhs);
            const A = $.valueOf(makeList(MATH_POW, b, two));
            const B = makeList(opr, a, A);
            return [CHANGED, $.valueOf(B)];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_mul_2_aaa_bbb_bbb = new Builder();
