import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { hash_binop_atom_atom, HASH_IMU, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Imu } from "../../tree/imu/Imu";
import { negOne, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_imu } from "../imu/is_imu";
import { is_rat } from "../rat/rat_extension";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Imu;
type RHS = Rat;
type EXP = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('pow_2_imu_rat', MATH_POW, is_imu, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_IMU, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // TODO: Generalize
        if (rhs.isTwo()) {
            return [TFLAG_DIFF, negOne];
        }
        else if (rhs.isMinusOne()) {
            return [TFLAG_DIFF, $.negate(imu)];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_2_imu_rat = new Builder();
