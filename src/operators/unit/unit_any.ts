import { Sym } from "math-expression-atoms";
import { Cons1, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { UNIT } from "../../runtime/constants";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { unit } from "./transform-unit";

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
        super('unit', UNIT, is_any, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        return unit(arg, expr, $);
    }
}

export const unit_any = new Builder();
