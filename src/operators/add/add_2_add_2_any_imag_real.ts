import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.isImag(lhs.rhs) && $.isReal(rhs);
    };
}

/**
 * (X + imag) + real => (X + real) + imag
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_any_imag_real', MATH_ADD, and(is_cons, is_add_2_any_any), is_any, cross($), $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const X = lhs.lhs;
        const I = lhs.rhs;
        const R = rhs;
        const XR = $.valueOf(makeList(MATH_ADD, X, R));
        const retval = $.valueOf(makeList(MATH_ADD, XR, I));
        return [TFLAG_DIFF, retval];
    }
}

export const add_2_add_2_any_imag_real = new Builder();
