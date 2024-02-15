import { Boo, is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons1, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { Function1 } from "../helpers/Function1";

type ARG = Rat;
type EXP = Cons1<Sym, ARG>;

function eval_iszero_rat(expr: EXP, $: Pick<ExtensionEnv, 'getDirective'>): U {
    const arg = expr.arg;
    try {
        return iszero_rat(arg, $);
    }
    finally {
        arg.release();
    }
}

function iszero_rat(arg: Rat, $: Pick<ExtensionEnv, 'getDirective'>): Boo | Rat {
    return predicate_return_value(arg.isZero(), $);
}


class Op extends Function1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('iszero_rat', native_sym(Native.iszero), is_rat);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_iszero_rat(expr, $);
    }
    transform1(opr: Sym, arg: Rat, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_rat(arg, $)];
    }
}

export const iszero_rat_builder = mkbuilder(Op);
