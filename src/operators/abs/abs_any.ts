import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_ABS } from "./MATH_ABS";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    constructor($: ExtensionEnv) {
        super('abs_any', MATH_ABS, is_any, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        // TODO: Perhaps we should qualify that we are unpacking functions.
        // console.lg(`expr=${print_expr(expr, $)}`);
        const A = $.inner(arg, arg);
        const B = $.power(A, half);
        return [TFLAG_DIFF, B];
    }
}

export const abs_any = new Builder();
