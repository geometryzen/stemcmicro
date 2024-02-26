import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_FLT, hash_unaop_atom } from "../../hashing/hash_info";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { create_flt, Flt, piAsFlt, zeroAsFlt } from "../../tree/flt/Flt";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function1 } from "../helpers/Function1";

const LOG = native_sym(Native.log);

class Op extends Function1<Flt> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('log_flt', LOG, is_flt);
        this.#hash = hash_unaop_atom(LOG, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, x: Flt, expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(x));
        if (x.isOne()) {
            return [TFLAG_DIFF, zeroAsFlt];
        }
        else if (x.isZero()) {
            return [TFLAG_DIFF, hook_create_err(expr)];
        }
        else if (x.isNegative()) {
            if (x.isMinusOne()) {
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

export const log_flt = mkbuilder(Op);
