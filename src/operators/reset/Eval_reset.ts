import { create_sym, Sym } from "math-expression-atoms";
import { Cons, nil, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { assert_atom } from "../atom/Cell";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type A = U;
type B = U;
type EXP = Cons2<Sym, A, B>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Eval_reset(expr: EXP, $: ExtensionEnv): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    try {
        const atom = assert_atom($.valueOf(lhs));
        const data = $.valueOf(rhs);
        try {
            atom.reset(data);
            return nil;
        }
        finally {
            atom.release();
            data.release();
        }
    }
    finally {
        lhs.release();
        rhs.release();
    }
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        const RESET = create_sym("reset!");
        try {
            return new Op($, RESET);
        }
        finally {
            RESET.release();
        }
    }
}

class Op extends Function2<A, B> {
    readonly #hash: string;
    constructor($: ExtensionEnv, RESET: Sym) {
        super('reset!', RESET, is_any, is_any, $);
        this.#hash = hash_binop_atom_atom(RESET, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: A, rhs: B, expr: EXP): [TFLAGS, U] {
        const retval = Eval_reset(expr, this.$);
        return [TFLAG_DIFF, retval];
    }
}

export const reset_builder = new Builder();
