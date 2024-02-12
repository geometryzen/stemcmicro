import { Boo, is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { Cons1 } from "../helpers/Cons1";
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

class OpBuilder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        const ISZERO = native_sym(Native.iszero);
        try {
            return new Op($, ISZERO);
        }
        finally {
            ISZERO.release();
        }
    }
}


class Op extends Function1<Rat> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv, ISZERO: Sym) {
        super('iszero_rat', ISZERO, is_rat, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return eval_iszero_rat(expr, this.$);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_rat(arg, this.$)];
    }
}

export const iszero_rat_builder = new OpBuilder();
