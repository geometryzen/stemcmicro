import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { is_imu } from "../../predicates/is_imu";
import { MATH_INNER, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, makeList, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, Rat, Rat>;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * i | X => conj(i) * (1 | X) => -i * (1|X)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_2_imu_any', MATH_INNER, is_imu, is_any, $);
        this.hash = hash_binop_cons_atom(MATH_INNER, MATH_POW, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const i = lhs;
        const X = rhs;
        const negI = $.negate(i);
        const inrP = $.valueOf(makeList(opr, one, X));
        const retval = $.valueOf(makeList(MATH_MUL, negI, inrP));
        return [TFLAG_DIFF, retval];
    }
}

export const inner_2_imu_any = new Builder();
