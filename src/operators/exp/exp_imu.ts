import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_IMU, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Imu } from "../../tree/imu/Imu";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_imu } from "../imu/is_imu";

export const MATH_EXP = native_sym(Native.exp);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Imu> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('exp_imu', MATH_EXP, is_imu, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_IMU);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, imu: Imu, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ($.getDirective(Directive.convertExpToTrig)) {
            const c = $.cos(one);
            const s = $.sin(one);
            return [TFLAG_DIFF, $.add(c, $.multiply(imu, s))];
        }
        else {
            return [TFLAG_NONE, outerExpr];
        }
    }
}

export const exp_imu = new Builder();
