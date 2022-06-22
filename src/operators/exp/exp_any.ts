import { binop } from "../../calculators/binop";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { MATH_E, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_EXP } from "./MATH_EXP";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Exp($);
    }
}

/*
function Eval_exp(expr: Cons, $: ExtensionEnv): U {
    const A = cadnr(expr, 1);
    const B = $.valueOf(A);
    const C = exp(B, $);
    return C;
}
*/

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Exp extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    // readonly phases = PHASE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('exp_any', MATH_EXP, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            return [TFLAG_DIFF, binop(MATH_POW, MATH_E, arg, $)];
        }
        else {
            // The argument is evaluated by the base class in all other phases.
            return [TFLAG_NONE, expr];
        }
    }
}

export const exp_any = new Builder();
