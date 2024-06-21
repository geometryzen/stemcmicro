import { Boo, booF, Imu, is_imu, Rat, Sym, zero } from "@stemcmicro/atoms";
import { HASH_IMU, hash_unaop_atom } from "@stemcmicro/hashing";
import { Native, native_sym } from "@stemcmicro/native";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Function1 } from "../helpers/Function1";

class IsRealImu extends Function1<Imu> {
    readonly #hash: string;
    readonly #false: Boo | Rat;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("is_real_imu", native_sym(Native.isreal), is_imu);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
        this.#false = config.useIntegersForPredicates ? zero : booF;
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Imu): [TFLAGS, U] {
        return [TFLAG_DIFF, this.#false];
    }
}

export const is_real_imu = mkbuilder(IsRealImu);
