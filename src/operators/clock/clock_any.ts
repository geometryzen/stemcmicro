import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { clock } from "./clock";

export const CLOCK = native_sym(Native.clock);

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('clock_any', CLOCK, is_any);
        this.#hash = hash_unaop_atom(CLOCK, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, oldExpr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(arg));
        if ($.isExpanding()) {
            const newExpr = clock(arg, $);
            return [TFLAG_DIFF, newExpr];
        }
        else {
            return [TFLAG_NONE, oldExpr];
        }
    }
}

export const clock_any = mkbuilder(Op);
