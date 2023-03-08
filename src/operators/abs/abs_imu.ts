import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { Imu } from "../../tree/imu/ImaginaryUnit";
import { one } from "../../tree/rat/Rat";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_imu } from "../imu/is_imu";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Imu> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('abs_imu', create_sym('abs'), is_imu, $);
        this.hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    transform1(opr: Sym, arg: Imu, expr: UCons<Sym, Imu>): [TFLAGS, U] {
        return wrap_as_transform(one, expr);
    }
}

export const abs_imu = new Builder();
