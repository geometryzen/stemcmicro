import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "@stemcmicro/hashing";
import { IMAG } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("imag", IMAG, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
        /*
        // console.lg(this.name, this.$.toInfixString(arg));
        const $ = this.$;
        const retval = im(arg, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
        */
    }
}

export const imag_any = mkbuilder<EXP>(Op);
