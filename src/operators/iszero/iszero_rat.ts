import { Boo, booF, booT, is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";
import { Cons1 } from "../helpers/Cons1";

type ARG = Rat;
type EXP = Cons1<Sym, ARG>;

function Eval_iszero_rat(expr: EXP): U {
    const arg = expr.arg;
    try {
        return iszero_rat(arg);
    }
    finally {
        arg.release();
    }
}

function iszero_rat(arg: Rat): Boo {
    return arg.isZero() ? booT : booF;
}

class ExpRatBuilder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

const ISZERO = native_sym(Native.iszero);

class Op extends Function1<Rat> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('iszero_rat', ISZERO, is_rat, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return Eval_iszero_rat(expr);
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, iszero_rat(arg)];
    }
}

export const iszero_rat_builder = new ExpRatBuilder();
