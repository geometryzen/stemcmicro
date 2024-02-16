import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_imu } from "../imu/is_imu";
import { MATH_CONJ } from "./MATH_CONJ";

class ConjImaginaryUnit extends Function1<U> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('conj_imu', MATH_CONJ, is_imu);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(MATH_MUL, negOne, arg)];
    }
}

export const conj_imu = mkbuilder(ConjImaginaryUnit);
