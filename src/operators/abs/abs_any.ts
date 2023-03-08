import { ExtensionEnv, MODE_EXPANDING, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_atom, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";
import { wrap_as_transform } from "../wrap_as_transform";
import { Eval_abs } from "./eval_abs";
import { MATH_ABS } from "./MATH_ABS";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

/**
 * abs(X) => (expt (inner X X) 1/2)
 * 
 * This general replacement of the abs function with an inner product requires the concept of conjugation to unpack the inner product.
 * It should work for real numbers, complex numbers, blades, tensors and scalars.
 */
class Op extends Function1<ARG> implements Operator<EXP> {
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('abs_any', MATH_ABS, is_any, $);
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const arg = expr.arg;
            if (is_sym(arg)) {
                return true;
            }
            else if (is_atom(arg)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const retval = Eval_abs(expr, $);
        return wrap_as_transform(retval, expr);
    }
}

export const abs_any = new Builder();
