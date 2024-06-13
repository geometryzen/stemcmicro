import { half } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "@stemcmicro/native";
import { native_sym } from "@stemcmicro/native";
import { imu, Imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_imu } from "../imu/is_imu";

const LOG = native_sym(Native.log);
const PI = native_sym(Native.PI);

type ARG = Imu;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("log_imu", LOG, is_imu);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.multiply(half, imu, PI)];
    }
}

export const log_imu = mkbuilder<EXP>(Op);
