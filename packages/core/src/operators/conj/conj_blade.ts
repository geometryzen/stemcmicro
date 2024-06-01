import { Blade, is_blade } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { MATH_CONJ } from "./MATH_CONJ";

class ConjBlade extends Function1<Blade> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super("conj_blade", MATH_CONJ, is_blade);
    }
    transform1(opr: Sym, arg: Blade): [TFLAGS, U] {
        return [TFLAG_DIFF, arg.rev()];
    }
}

export const conj_blade = mkbuilder(ConjBlade);
