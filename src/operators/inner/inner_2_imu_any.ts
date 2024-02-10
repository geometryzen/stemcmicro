import { Imu, is_imu } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_IMU } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Imu;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * i | X => conj(i) * (1 | X) => -i * (1|X)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('inner_2_imu_any', MATH_INNER, is_imu, is_any, $);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_IMU, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const i = lhs;
        const X = rhs;
        const negI = $.negate(i);
        const inrP = $.valueOf(items_to_cons(opr, one, X));
        const retval = $.valueOf(items_to_cons(MATH_MUL, negI, inrP));
        return [TFLAG_DIFF, retval];
    }
}

export const inner_2_imu_any = new Builder();
