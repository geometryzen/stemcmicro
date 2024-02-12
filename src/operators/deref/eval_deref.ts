import { assert_cell, create_sym, Sym } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        const DEREF = create_sym("deref");
        try {
            return new Op($, DEREF);
        }
        finally {
            DEREF.release();
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function eval_deref(expr: EXP, $: ExtensionEnv): U {
    const arg = expr.arg;
    try {
        const value = $.valueOf(arg);
        try {
            const atom = assert_cell(value);
            return atom.deref();
        }
        finally {
            value.release();
        }
    }
    finally {
        arg.release();
    }
}

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv, DEREF: Sym) {
        super('deref', DEREF, is_any, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: EXP): [number, U] {
        const $ = this.$;
        const retval = eval_deref(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        throw new Error("TODO");
    }
}

export const deref_builder = new Builder();
