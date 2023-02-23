import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
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
        const $ = this.$;
        if ($.isExpanding()) {
            return transform_sin(arg, oldExpr, $);
        }
        else {
            return [TFLAG_NONE, oldExpr];
        }
    }
}

export const sin_any = new Builder();
