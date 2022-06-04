import { ExtensionEnv, Operator, OperatorBuilder, FOCUS_FACTORING, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_mul_2_any_imu } from "../mul/is_mul_2_any_imu";
import { is_add_2_any_any } from "./is_add_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LR = BCons<Sym, Rat, Rat>
type LHS = BCons<Sym, LL, LR>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isImag(lhs.rhs) && $.isImag(rhs);
    };
}

/**
 * (X + imag1) + imag2 => X + (imag1 + imag2)
 * 
 * (X + Y * i) + Z * i => X + (Y + Z) * i
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = FOCUS_FACTORING;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_imag_imag', MATH_ADD, and(is_cons, is_add_2_any_any), is_any, cross($), $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const imag1 = lhs.rhs;
        const imag2 = rhs;
        if (is_cons(imag1) && is_mul_2_any_imu(imag1) && is_cons(imag2) && is_mul_2_any_imu(imag2)) {
            const Y = imag1.lhs;
            const Z = imag2.lhs;
            const YZ = $.valueOf(items_to_cons(MATH_ADD, Y, Z));
            const YZi = $.valueOf(items_to_cons(MATH_MUL, YZ, imu));
            const retval = $.valueOf(items_to_cons(MATH_ADD, X, YZi));
            return [TFLAG_DIFF, retval];
        }
        return [TFLAG_NONE, expr];
    }
}

export const add_2_add_2_any_imag_imag = new Builder();
