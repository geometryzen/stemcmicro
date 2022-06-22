import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { MATH_LT } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { is_add } from "../add/is_add";
import { is_boo } from "../boo/is_boo";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";
import { cosine_of_angle } from "./cosine_of_angle";
import { cosine_of_angle_sum } from "./cosine_of_angle_sum";
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
    transform1(opr: Sym, arg: ARG, oldExpr: EXP): [TFLAGS, U] {
        // console.log(`${this.name} arg=${render_as_infix(arg, this.$)}`);
        const $ = this.$;
        const arg_LT_0 = $.valueOf(items_to_cons(MATH_LT, arg, zero));
        // console.log(`${this.name} arg=${render_as_infix(arg_LT_0, this.$)}`);
        if (is_boo(arg_LT_0)) {
            if (arg_LT_0.isTrue()) {
                const A = $.negate(arg);
                const B = $.valueOf(items_to_cons(MATH_COS, A));
                return [TFLAG_DIFF, B];
            }
            else {
                if (is_cons(arg) && is_add(arg)) {
                    return cosine_of_angle_sum(arg, oldExpr, $);
                }
                else {
                    return cosine_of_angle(arg, oldExpr, $);
                }
            }
        }
        return [TFLAG_HALT, oldExpr];
    }
}

export const cos_any = new Builder();
