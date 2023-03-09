import { binop } from "../../calculators/binop";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

const MATH_E = native_sym(Native.E);
const MATH_EXP = native_sym(Native.exp);
const MATH_POW = native_sym(Native.pow);

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
        // console.lg(this.name, this.$.toSExprString(expr));
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
