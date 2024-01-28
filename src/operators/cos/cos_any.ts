import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { Cons1 } from "../helpers/Cons1";
import { MATH_COS } from "./MATH_COS";
import { transform_cos } from "./transform_cos";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('cos_any', MATH_COS, is_any, $);
        this.#hash = hash_unaop_atom(MATH_COS, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, orig: EXP): [TFLAGS, U] {
        
        if (this.$.isExpanding()) {
            return transform_cos(arg, orig, this.$);
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const cos_any = new Builder();
