import { one } from "@stemcmicro/atoms";
import { is_base_of_natural_logarithm } from "@stemcmicro/helpers";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_sym } from "../sym/is_sym";

export const MATH_LOG = native_sym(Native.log);

class Op extends Function1<Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("log_sym", MATH_LOG, is_sym);
        this.#hash = hash_unaop_atom(MATH_LOG, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, x: Sym, expr: U): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(x));
        if (is_base_of_natural_logarithm(x)) {
            return [TFLAG_DIFF, one];
        }
        return [TFLAG_NONE, expr];
    }
}

export const log_sym = mkbuilder(Op);
