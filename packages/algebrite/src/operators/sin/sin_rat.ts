import { Rat, zero } from "@stemcmicro/atoms";
import { HASH_RAT, hash_unaop_atom } from "@stemcmicro/hashing";
import { is_negative } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";
import { sin_special_angles } from "./transform_sin";

export const MATH_SIN = native_sym(Native.sin);

class Op extends Function1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("sin_rat", MATH_SIN, is_rat);
        this.#hash = hash_unaop_atom(MATH_SIN, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, x: Rat, expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(x));
        if (x.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        // sine function is antisymmetric, sin(-x) = -sin(x)
        if (is_negative(x)) {
            return [TFLAG_DIFF, $.negate($.sin($.negate(x)))];
        }
        return sin_special_angles(x, expr, $);
    }
}

export const sin_rat = mkbuilder(Op);
