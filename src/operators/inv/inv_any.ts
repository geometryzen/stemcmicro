import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { inv } from "../../inv";
import { MATH_INV } from "../../runtime/ns_math";
import { cadr } from "../../tree/helpers";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { Cons1 } from "../helpers/Cons1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = U;
type EXP = Cons1<Sym, ARG>;

export function Eval_inv(expr: Cons, $: ExtensionEnv): U {
    const arg = $.valueOf(cadr(expr));
    return inv(arg, $);
}

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('inv_any', MATH_INV, is_any, $);
        this.#hash = hash_unaop_atom(MATH_INV, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const retval = inv(arg, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
    }
}

export const inv_any = new Builder();
