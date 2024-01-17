import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export const MATH_SQRT = native_sym(Native.sqrt);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Sqrt($);
    }
}

/**
 * sqrt(x) => (pow x 1/2)
 */
class Sqrt extends Function1<U> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('sqrt_any', MATH_SQRT, is_any, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        return [TFLAG_DIFF, this.$.power(arg, half)];
    }
}

export const sqrt_any = new Builder();
