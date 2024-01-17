import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_sym } from "../sym/is_sym";

const ARG = native_sym(Native.arg);
const E = native_sym(Native.E);
const PI = native_sym(Native.PI);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Sym;
type EXP = UCons<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('arg_sym', ARG, is_sym, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if (arg.equalsSym(E)) {
            return [TFLAG_DIFF, zero];
        }
        else if (arg.equalsSym(PI)) {
            return [TFLAG_DIFF, zero];
        }
        else if ($.isreal(arg)) {
            // The arg could still be zero, undefined, or pi.
            // But we don't know the sign.
            return [TFLAG_NONE, expr];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const arg_sym = new Builder();
