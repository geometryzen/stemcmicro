import { guess } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_cons, nil, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "@stemcmicro/hashing";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { factor, factor_again } from "./factor";

function factor_arg2(expr: Cons, P: U, $: ExtensionEnv): U {
    const arg2 = expr.item2;
    if (arg2.isnil) {
        return guess(P);
    } else {
        const val2 = $.valueOf(arg2);
        if (val2.isnil) {
            return guess(P);
        } else {
            return val2;
        }
    }
}

function factor_arg3(expr: Cons, $: ExtensionEnv): U {
    const arg3 = expr.item3;
    if (arg3.isnil) {
        return nil;
    } else {
        return $.valueOf(arg3);
    }
}

function factor_args(expr: Cons, $: ExtensionEnv): [P: U, X: U, Y: U] {
    const P = $.valueOf(expr.item1);
    const X = factor_arg2(expr, P, $);
    const Y = factor_arg3(expr, $);
    return [P, X, Y];
}

/**
 * Factor a polynomial or integer.
 * (factor P X) or (factor P X Y)
 */
export function eval_factor(expr: Cons, $: ExtensionEnv): U {
    const [P, X, Y] = factor_args(expr, $);
    const factors = factor(P, X, $);
    // console.lg("factors", $.toInfixString(factors));

    // more factoring?
    if (is_cons(Y)) {
        return [...Y].reduce((acc: U, p: U) => factor_again(acc, $.valueOf(p), $), factors);
    } else {
        return factors;
    }
}

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("factor", native_sym(Native.factor));
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_factor(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const factor_varargs = mkbuilder(Op);
