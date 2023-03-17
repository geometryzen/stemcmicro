import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Err } from "../../tree/err/Err";
import { create_flt, Flt, piAsFlt, zeroAsFlt } from "../../tree/flt/Flt";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";

export const LOG = native_sym(Native.log);
export const PI = native_sym(Native.PI);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Flt> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('log_flt', LOG, is_flt, $);
        this.hash = hash_unaop_atom(LOG, HASH_FLT);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, x: Flt, expr: U): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(x));
        if (x.isOne()) {
            return [TFLAG_DIFF, zeroAsFlt];
        }
        else if (x.isZero()) {
            return [TFLAG_DIFF, new Err(expr)];
        }
        else if (x.isNegative()) {
            const $ = this.$;
            if (x.isMinusOne()) {
                const $ = this.$;
                return [TFLAG_DIFF, $.multiply(imu, piAsFlt)];
            }
            else {
                const termRe = $.log($.negate(x));
                const termIm = $.multiply(imu, piAsFlt);
                return [TFLAG_DIFF, $.add(termRe, termIm)];
            }
        }
        return [TFLAG_DIFF, create_flt(Math.log(x.d))];
    }
}

export const log_flt = new Builder();
