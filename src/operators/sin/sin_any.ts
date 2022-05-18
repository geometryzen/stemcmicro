import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { MATH_LT } from "../../runtime/ns_math";
import { is_boo } from "../../tree/boo/is_boo";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { makeList, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_SIN } from "./MATH_SIN";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('sin_any', MATH_SIN, is_any, $);
        this.hash = hash_unaop_atom(MATH_SIN, HASH_ANY);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        // We want to know if the argument is negative.
        const $ = this.$;
        // WARNING: Embedding a tree for different evaluation could be problematic because it messes with the meta data.
        const arg_LT_0 = $.valueOf(makeList(MATH_LT, arg, zero));
        if (is_boo(arg_LT_0)) {
            if (arg_LT_0.isTrue()) {
                const A = $.negate(arg);
                const B = $.valueOf(makeList(MATH_SIN, A));
                const C = $.negate(B);
                return [CHANGED, C];
            }
            else {
                return [STABLE, expr];
            }
        }
        return [STABLE, expr];
    }
}

export const sin_any = new Builder();
