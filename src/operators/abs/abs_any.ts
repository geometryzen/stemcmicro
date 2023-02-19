import { ExtensionEnv, Operator, OperatorBuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { abs } from "./abs";
import { MATH_ABS } from "./MATH_ABS";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

/**
 * abs(X) => (power (inner X X) 1/2)
 * 
 * This general replacement of the abs function with an inner product requires the concept of conjugation to unpack the inner product.
 * It should work for real numbers, complex numbers, blades, tensors and scalars.
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('abs_any', MATH_ABS, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const retval = abs(arg, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];

        // TODO: Perhaps we should qualify that we are unpacking functions.
        // console.lg(`expr=${print_expr(expr, $)}`);
        /*
        const A = $.inner(arg, arg);
        const B = $.power(A, half);
        return [TFLAG_DIFF, B];
        */
    }
}

export const abs_any = new Builder();
