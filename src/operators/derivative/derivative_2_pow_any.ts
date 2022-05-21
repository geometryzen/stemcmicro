import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";
import { dpower } from "./helpers/dpower";
import { MATH_DERIVATIVE } from "./MATH_DERIVATIVE";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (derivative (power base expo) X)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('derivative_2_pow_any', MATH_DERIVATIVE, and(is_cons, is_opr_2_any_any(MATH_POW)), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_DERIVATIVE, MATH_POW, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const retval = dpower(lhs, rhs, $);
        const changed = !retval.equals(expr);
        return [changed ? CHANGED : NOFLAGS, retval];
    }
}

export const derivative_2_pow_any = new Builder();
