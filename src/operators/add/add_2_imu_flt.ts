import { Flt, Imu, is_flt, is_imu, Sym } from "math-expression-atoms";
import { Cons, Cons2, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, PHASE_FLAGS_EXPANDING_UNION_FACTORING, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_ADD, MATH_POW } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Imu;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Imu + Flt => Flt + Imu
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly phases = PHASE_FLAGS_EXPANDING_UNION_FACTORING;
    readonly dependencies: FEATURE[] = ['Flt', 'Imu'];
    constructor($: ExtensionEnv) {
        super('add_2_imu_flt', MATH_ADD, is_imu, is_flt, $);
        // TODO: This looks like it is assuming the structure of imu.
        this.#hash = hash_binop_cons_atom(MATH_ADD, MATH_POW, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export const add_2_imu_flt = new Builder();
