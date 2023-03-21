import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_BOO, HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { ISREAL } from "../../runtime/constants";
import { booF } from "../../tree/boo/Boo";
import { Imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_imu } from "../imu/is_imu";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealImu($);
    }
}

class IsRealImu extends Function1<Imu> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super(`${ISREAL.text}(expr: ${HASH_IMU}) => ${HASH_BOO}`, ISREAL, is_imu, $);
        this.hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: Imu): [TFLAGS, U] {
        return [TFLAG_DIFF, booF];
    }
}

export const is_real_imu = new Builder();
