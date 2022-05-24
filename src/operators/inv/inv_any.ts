import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { inv } from "../../inv";
import { MATH_INV } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

/*
function Eval_inv(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(cadr(expr));
    return inv(arg, $);
}
*/

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inv_any', MATH_INV, is_any, $);
        this.hash = hash_unaop_atom(MATH_INV, HASH_ANY);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const retval = inv(arg, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : NOFLAGS, retval];
    }
}

export const inv_any = new Builder();
