import { EnvConfig } from "../../env/EnvConfig";
import { Directive, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

const MATH_E = native_sym(Native.E);
const EXP = native_sym(Native.exp);

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("exp", EXP, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(expr), "isExpanding", this.$.isExpanding(), "isFactoring", this.$.isExpanding());
        if ($.getDirective(Directive.canonicalize)) {
            return [TFLAG_DIFF, $.power(MATH_E, arg)];
        } else {
            // The argument is evaluated by the base class in all other phases.
            return [TFLAG_NONE, expr];
        }
    }
}

export const exp = mkbuilder(Op);
