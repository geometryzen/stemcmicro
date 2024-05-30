import { is_rat, Rat, Sym, zero } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { hook_create_err } from "../../hooks/hook_create_err";
import { Function1 } from "../helpers/Function1";

const LOG = native_sym(Native.log);
const PI = native_sym(Native.PI);

class Op extends Function1<Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("log_rat", LOG, is_rat);
        this.#hash = hash_unaop_atom(LOG, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, x: Rat, expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, this.$.toInfixString(x));
        if (x.isOne()) {
            return [TFLAG_DIFF, zero];
        } else if (x.isZero()) {
            return [TFLAG_DIFF, hook_create_err(expr)];
        } else if (x.isMinusOne()) {
            return [TFLAG_DIFF, $.multiply(imu, PI)];
        } else if (x.isFraction()) {
            const m = x.numer();
            const n = x.denom();
            return [TFLAG_DIFF, $.subtract($.log(m), $.log(n))];
        } else if (x.isNegative()) {
            const termRe = $.log($.negate(x));
            const termIm = $.multiply(imu, PI);
            return [TFLAG_DIFF, $.add(termRe, termIm)];
        }
        return [TFLAG_NONE, expr];
    }
}

export const log_rat = mkbuilder(Op);
