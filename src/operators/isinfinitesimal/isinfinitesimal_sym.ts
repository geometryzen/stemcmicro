import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

const ISINFINITESIMAL = native_sym(Native.isinfinitesimal);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Sym> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('infinitesimal_sym', ISINFINITESIMAL, is_sym, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Sym): [TFLAGS, U] {
        const $ = this.$;
        const props = $.getSymbolPredicates(arg);
        // Note that zero is also infinitesimal, but this should be implied.
        if (props.infinitesimal) {
            return [TFLAG_DIFF, booT];
        }
        return [TFLAG_DIFF, booF];
    }
}

export const isinfinitesimal_sym = new Builder();
