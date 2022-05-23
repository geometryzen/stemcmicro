import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { MATH_LT } from "../../runtime/ns_math";
import { is_boo } from "../../tree/boo/is_boo";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { makeList, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_COS } from "./MATH_COS";

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
        super('cos_any', MATH_COS, is_any, $);
        this.hash = hash_unaop_atom(MATH_COS, HASH_ANY);
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const arg_LT_0 = $.valueOf(makeList(MATH_LT, arg, zero));
        if (is_boo(arg_LT_0)) {
            if (arg_LT_0.isTrue()) {
                const A = $.negate(arg);
                const B = $.valueOf(makeList(MATH_COS, A));
                return [TFLAG_DIFF, B];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        return [TFLAG_HALT, expr];
    }
}

export const cos_any = new Builder();
