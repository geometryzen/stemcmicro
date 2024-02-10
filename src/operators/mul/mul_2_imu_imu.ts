import { Imu, is_imu } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_IMU } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Imu;
type RHS = Imu;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * i * i => -1
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Imu'];
    constructor($: ExtensionEnv) {
        super('mul_2_imu_imu', MATH_MUL, is_imu, is_imu, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_IMU, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        return [TFLAG_DIFF, negOne];
    }
}

export const mul_2_imu_imu = new Builder();
