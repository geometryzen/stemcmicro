import { one } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_imu } from "../imu/is_imu";
import { wrap_as_transform } from "../wrap_as_transform";

class Op extends Function1<Imu> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("abs_imu", native_sym(Native.abs), is_imu);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: Imu, expr: Cons1<Sym, Imu>): [TFLAGS, U] {
        return wrap_as_transform(one, expr);
    }
}

export const abs_imu = mkbuilder(Op);
