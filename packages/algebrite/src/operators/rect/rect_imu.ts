import { HASH_IMU, hash_unaop_atom } from "@stemcmicro/hashing";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_imu } from "../imu/is_imu";

const RECT = native_sym(Native.rect);

class Op extends Function1<Imu> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("rect_imu", RECT, is_imu);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Imu): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const rect_imu = mkbuilder(Op);
