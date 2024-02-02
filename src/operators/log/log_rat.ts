import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Err } from "../../tree/err/Err";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_rat } from "../rat/is_rat";

const LOG = native_sym(Native.log);
const PI = native_sym(Native.PI);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Rat> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('log_rat', LOG, is_rat, $);
        this.#hash = hash_unaop_atom(LOG, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, x: Rat, expr: U): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(x));
        if (x.isOne()) {
            return [TFLAG_DIFF, zero];
        }
        else if (x.isZero()) {
            return [TFLAG_DIFF, new Err(expr)];
        }
        else if (x.isMinusOne()) {
            const $ = this.$;
            return [TFLAG_DIFF, $.multiply(imu, PI)];
        }
        else if (x.isFraction()) {
            const $ = this.$;
            const m = x.numer();
            const n = x.denom();
            return [TFLAG_DIFF, $.subtract($.log(m), $.log(n))];
        }
        else if (x.isNegative()) {
            const $ = this.$;
            const termRe = $.log($.negate(x));
            const termIm = $.multiply(imu, PI);
            return [TFLAG_DIFF, $.add(termRe, termIm)];
        }
        return [TFLAG_NONE, expr];
    }
}

export const log_rat = new Builder();

