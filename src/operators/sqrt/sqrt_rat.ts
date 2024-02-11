import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { half } from "../../tree/rat/Rat";
import { Function1 } from "../helpers/Function1";

export const MATH_SQRT = native_sym(Native.sqrt);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * sqrt(x: Rat) => (pow x 1/2)
 */
class Op extends Function1<Rat> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('sqrt_rat', MATH_SQRT, is_rat, $);
        this.#hash = hash_unaop_atom(MATH_SQRT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Rat): [TFLAGS, U] {
        // console.lg(this.name, `${arg}`);
        return [TFLAG_DIFF, this.$.power(arg, half)];
    }
}

export const sqrt_rat = new Builder();
