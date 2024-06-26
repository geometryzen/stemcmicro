import { one, Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_rat } from "../rat/is_rat";

class Op extends Function2<U, Rat> {
    // readonly hash;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_any_rat", MATH_POW, is_any, is_rat);
    }
    transform2(opr: Sym, base: U, expo: Rat, expr: Cons2<Sym, U, Rat>): [TFLAGS, U] {
        // console.lg(this.name);
        if (expo.isZero()) {
            return [TFLAG_DIFF, one];
        } else if (expo.isOne()) {
            return [TFLAG_DIFF, base];
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_2_any_rat = mkbuilder(Op);
