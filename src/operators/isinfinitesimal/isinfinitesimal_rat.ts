import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealRat($);
    }
}

type ARG = Rat;

class IsRealRat extends Function1<ARG> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('isinfinitesimal_rat', ISINFINITESIMAL, is_rat, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG): [TFLAGS, U] {
        if (arg.isZero()) {
            return [TFLAG_DIFF, booT];
        }
        return [TFLAG_DIFF, booF];
    }
}

export const isinfinitesimal_rat = new Builder();
