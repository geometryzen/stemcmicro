import { Boo, is_tensor, Rat, Sym, Tensor } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_TENSOR, hash_unaop_atom } from "../../hashing/hash_info";
import { predicate_return_value } from "../../helpers/predicate_return_value";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";

type ARG = Tensor;
type EXP = Cons1<Sym, ARG>;

function Eval_iszero_tensor(expr: EXP, $: Pick<ExtensionEnv, 'getDirective' | 'iszero'>): U {
    // console.lg("Eval_iszero_tensor", `${expr}`);
    const arg = expr.arg;
    try {
        return iszero_tensor(arg, $);
    }
    finally {
        arg.release();
    }
}

function iszero_tensor(arg: Tensor, $: Pick<ExtensionEnv, 'getDirective' | 'iszero'>): Boo | Rat {
    // console.lg("iszero_tensor", `${arg}`);
    const n = arg.nelem;
    for (let i = 0; i < n; i++) {
        if (!$.iszero(arg.elems[i])) {
            return predicate_return_value(false, $);
        }
    }
    return predicate_return_value(true, $);
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


class Op extends Function1<Tensor> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv, ISZERO: Sym) {
        super('iszero_tensor', ISZERO, is_tensor, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return Eval_iszero_tensor(expr, this.$);
    }
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_tensor(arg, this.$)];
    }
}

export const iszero_tensor_builder = new OpBuilder();
