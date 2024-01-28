import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { Imu } from "../../tree/imu/Imu";
import { half } from "../../tree/rat/Rat";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { Cons1 } from "../helpers/Cons1";
import { is_imu } from "../imu/is_imu";

const Pi = native_sym(Native.PI);
const POLAR = native_sym(Native.polar);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type ARG = Imu;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('polar_imu', POLAR, is_imu, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: ARG, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.exp($.multiply(half, Pi))];
    }
}

export const polar_imu = new Builder();
