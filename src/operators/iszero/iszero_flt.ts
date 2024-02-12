import { Boo, Flt, is_flt, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";

type ARG = Flt;
type EXP = Cons1<Sym, ARG>;

function eval_iszero_flt(expr: EXP, $: Pick<ExtensionEnv, 'getDirective'>): U {
    const arg = expr.arg;
    try {
        return iszero_flt(arg, $);
    }
    finally {
        arg.release();
    }
}

function iszero_flt(arg: Flt, $: Pick<ExtensionEnv, 'getDirective'>): Boo | Rat {
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


class Op extends Function1<Flt> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv, ISZERO: Sym) {
        super('iszero_flt', ISZERO, is_flt, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return eval_iszero_flt(expr, this.$);
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_flt(arg, this.$)];
    }
}

export const iszero_flt_builder = new OpBuilder();
