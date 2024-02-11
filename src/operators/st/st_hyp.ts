import { Hyp, is_hyp, Sym, zero } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_HYP, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { MATH_STANDARD_PART } from "./MATH_STANDARD_PART";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Hyp;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('st_hyp', MATH_STANDARD_PART, is_hyp, $);
        this.#hash = hash_unaop_atom(MATH_STANDARD_PART, HASH_HYP);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Hyp, expr: EXP): [TFLAGS, U] {
        return [TFLAG_DIFF, zero];
    }
}

export const st_hyp = new Builder();
