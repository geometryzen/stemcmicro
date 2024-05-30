import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

const RECT = native_sym(Native.rect);

class Op extends Function1<Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("rect_sym", RECT, is_sym);
        this.#hash = hash_unaop_atom(this.opr, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Sym, rectExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isreal(arg)) {
            return [TFLAG_DIFF, arg];
        } else {
            return [TFLAG_NONE, rectExpr];
        }
    }
}

export const rect_sym = mkbuilder(Op);
