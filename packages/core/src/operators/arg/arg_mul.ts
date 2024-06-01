import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Flt, oneAsFlt } from "../../tree/flt/Flt";
import { Rat, zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { CompositeOperator } from "../helpers/CompositeOperator";
import { is_rat } from "../rat/is_rat";

const ARG = native_sym(Native.arg);
const MUL = native_sym(Native.multiply);
const PI = native_sym(Native.PI);

/**
 * [-pi,pi]
 * @param arg
 * @param $
 * @returns
 */
function principal_value_radians(arg: U, $: ExtensionEnv): U {
    const pis = $.divide(arg, PI);
    // console.lg("pis", $.toInfixString(pis));
    if (is_rat(pis)) {
        return $.multiply(principal_value_rats(pis, $), PI);
    } else if (is_flt(pis)) {
        return $.multiply(principal_value_flts(pis, $), PI);
    }
    return arg;
}

function principal_value_rats(arg: Rat, $: ExtensionEnv): U {
    if (arg.isOne()) {
        return arg;
    } else if (arg.isMinusOne()) {
        return arg;
    } else if (arg.pred().isPositive()) {
        return principal_value_rats(arg.pred().pred(), $);
    } else if (arg.succ().isNegative()) {
        return principal_value_rats(arg.succ().succ(), $);
    }
    return arg;
}

function principal_value_flts(arg: Flt, $: ExtensionEnv): U {
    // console.lg("pvf", $.toInfixString(arg));
    if (arg.isOne()) {
        return arg;
    } else if (arg.isMinusOne()) {
        return arg;
    } else if (arg.sub(oneAsFlt).isPositive()) {
        return principal_value_flts(arg.sub(oneAsFlt).sub(oneAsFlt), $);
    } else if (arg.add(oneAsFlt).isNegative()) {
        return principal_value_flts(arg.add(oneAsFlt).add(oneAsFlt), $);
    }
    return arg;
}

/**
 * arg(a * b * c ...) = arg(a) + arg(b) + arg(c) + ...
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(ARG, MUL);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const sum = innerExpr
            .tail()
            .map($.arg)
            .reduce((lhs, rhs) => $.add(lhs, rhs), zero);
        const pv = principal_value_radians(sum, $);
        return [TFLAG_DIFF, pv];
    }
}

export const arg_mul = mkbuilder(Op);
