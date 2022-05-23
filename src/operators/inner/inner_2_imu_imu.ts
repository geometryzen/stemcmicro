
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_imu } from "../../predicates/is_imu";
import { MATH_INNER } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * i | i => conj(i) * i => -i * i => 1
 */
class Op extends Function2<BCons<Sym, Rat, Rat>, BCons<Sym, Rat, Rat>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_imu_imu', MATH_INNER, is_imu, is_imu, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: BCons<Sym, Rat, Rat>, rhs: BCons<Sym, Rat, Rat>): [TFLAGS, U] {
        return [TFLAG_DIFF, one];
    }
}

export const inner_2_imu_imu = new Builder();
