
import { Blade, is_blade, Sym, zero } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_INNER } from "../../runtime/ns_math";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_scalar } from "../helpers/is_scalar";

/**
 * Blade | Scalar => Blade.scp(Scalar) => 0, because of the different grades.
 */
class Op extends Function2<Blade, U> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('inner_2_vec_scalar', MATH_INNER, is_blade, is_scalar);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Blade, rhs: U, orig: Cons2<Sym, Blade, U>): [TFLAGS, U] {
        return [TFLAG_DIFF, zero];
    }
}

export const inner_2_vec_scalar = mkbuilder(Op);
