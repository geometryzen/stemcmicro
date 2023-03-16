import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { MATH_EXP } from "../exp/MATH_EXP";
import { and } from "../helpers/and";
import { Function1 } from "../helpers/Function1";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { UCons } from "../helpers/UCons";

export const abs = native_sym(Native.abs);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = UCons<Sym, U>;
type EXP = UCons<Sym, ARG>;

/**
 * abs(exp(a+b*i)) => (expt (inner X X) 1/2)
 * 
 * This general replacement of the abs function with an inner product requires the concept of conjugation to unpack the inner product.
 * It should work for real numbers, complex numbers, blades, tensors and scalars.
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('abs_exp', abs, and(is_cons, is_opr_1_any(MATH_EXP)), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, $.toInfixString(arg));
        // TODO: Perhaps we should qualify that we are unpacking functions.
        // console.lg(`expr=${print_expr(expr, $)}`);
        const A = $.inner(arg, arg);
        const B = $.power(A, half);
        return [TFLAG_DIFF, B];
    }
}

export const abs_exp = new Builder();
