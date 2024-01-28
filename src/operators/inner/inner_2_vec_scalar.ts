
import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_INNER } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_scalar } from "../helpers/is_scalar";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Blade | Scalar => Blade.scp(Scalar) => 0, because of the different grades.
 */
class Op extends Function2<Blade, U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_vec_scalar', MATH_INNER, is_blade, is_scalar($), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Blade, rhs: U, orig: Cons2<Sym, Blade, U>): [TFLAGS, U] {
        return [TFLAG_DIFF, zero];
    }
}

export const inner_2_vec_scalar = new Builder();
