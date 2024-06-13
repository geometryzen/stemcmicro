import { Imu, is_imu, one, Sym } from "@stemcmicro/atoms";
import { Directive } from "@stemcmicro/directive";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { Function1 } from "../helpers/Function1";

export const MATH_EXP = native_sym(Native.exp);

class Op extends Function1<Imu> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("exp_imu", MATH_EXP, is_imu);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, imu: Imu, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        if ($.getDirective(Directive.convertExpToTrig)) {
            const c = $.cos(one);
            const s = $.sin(one);
            return [TFLAG_DIFF, $.add(c, $.multiply(imu, s))];
        } else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

export const exp_imu = mkbuilder(Op);
