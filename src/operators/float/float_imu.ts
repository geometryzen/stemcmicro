import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { is_imu } from "../imu/is_imu";
import { FLOAT } from "../../runtime/constants";
import { Flt } from "../../tree/flt/Flt";
import { Imu } from "../../tree/imu/ImaginaryUnit";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new FloatFlt($);
    }
}

class FloatFlt extends Function1<Imu> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('float_imu', FLOAT, is_imu, $);
        this.hash = hash_unaop_atom(FLOAT, HASH_IMU);
    }
    transform1(opr: Sym, arg: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, arg];
    }
}

export const float_imu = new Builder();
