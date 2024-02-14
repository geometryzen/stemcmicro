import { assert_cell, create_sym, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, make_extension_builder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type A = U;
type B = U;
type EXP = Cons2<Sym, A, B>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function eval_reset(expr: EXP, $: ExtensionEnv): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    try {
        const atom = assert_cell($.valueOf(lhs));
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

class Op extends Function2<A, B> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('reset!', create_sym("reset!"), is_any, is_any);
        this.#hash = hash_binop_atom_atom(create_sym("reset!"), HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: A, rhs: B, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = eval_reset(expr, $);
        return [TFLAG_DIFF, retval];
    }
}

export const reset_builder = make_extension_builder(Op);
