import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_STR, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_hyp } from "../../tree/hyp/Hyp";
import { Str } from "../../tree/str/Str";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_str } from "../str/str_extension";

const INFINITESIMAL = native_sym(Native.infinitesimal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new OP($);
    }
}

/**
 * (infinitesimal Str) 
 */
class OP extends Function1<Str> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('infinitesimal', INFINITESIMAL, is_str, $);
        this.#hash = hash_unaop_atom(INFINITESIMAL, HASH_STR);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Str): [TFLAGS, U] {
        return [TFLAG_DIFF, create_hyp(arg.str)];
    }
}

export const infinitesimal_1_str = new Builder();
