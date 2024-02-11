import { Sym } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

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
        super('st_any', MATH_STANDARD_PART, is_any, $);
        this.#hash = hash_unaop_atom(MATH_STANDARD_PART, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isreal(arg)) {
            return [TFLAG_DIFF, arg];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const st_any = new Builder();
