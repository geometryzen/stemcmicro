import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { MATH_ADD, MATH_RCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = BCons<Sym, U, U>;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * a >> (b + c) => (a >> b) + (a >> c)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_any_add_2_any_any', MATH_RCO, is_any, and(is_cons, is_opr_2_any_any(MATH_ADD)), $);
        this.hash = hash_binop_atom_cons(MATH_RCO, HASH_ANY, MATH_ADD);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const a = lhs;
        const b = rhs.lhs;
        const c = rhs.rhs;
        const ab = $.valueOf(makeList(opr, a, b));
        const ac = $.valueOf(makeList(opr, a, c));
        const retval = $.valueOf(makeList(rhs.opr, ab, ac));
        return [CHANGED, retval];
    }
}

export const rco_2_any_add_2_any_any = new Builder();
