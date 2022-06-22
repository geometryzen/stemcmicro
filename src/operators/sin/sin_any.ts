import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { MATH_LT } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { is_boo } from "../boo/is_boo";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { MATH_SIN } from "./MATH_SIN";
import { transform_sin } from "./transform_sin";

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
    transform1(opr: Sym, arg: ARG, oldExpr: EXP): [TFLAGS, U] {
        // console.lg(`${this.name} arg=${arg}, oldExpr=${oldExpr}`);
        const $ = this.$;
        const arg_LT_0 = $.valueOf(items_to_cons(MATH_LT, arg, zero));
        // console.lg(`${this.name} arg_LT_0=${arg_LT_0}, oldExpr=${oldExpr}`);
        if (is_boo(arg_LT_0)) {
            if (arg_LT_0.isTrue()) {
                const A = $.negate(arg);
                const B = $.valueOf(items_to_cons(MATH_SIN, A));
                const C = $.negate(B);
                return [TFLAG_DIFF, C];
            }
            else {
                return transform_sin(arg, oldExpr, $);
            }
        }
        return [TFLAG_HALT, oldExpr];
    }
}

export const sin_any = new Builder();
