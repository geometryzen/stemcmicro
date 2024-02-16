import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { CompositeOperator } from "../helpers/CompositeOperator";

const IM = native_sym(Native.imag);
const MUL = native_sym(Native.multiply);

/**
 */
class Op extends CompositeOperator {
    constructor(readonly config: Readonly<EnvConfig>) {
        super(IM, MUL);
    }
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const rs: U[] = []; // the real factors.
        const cs: U[] = []; // the complex factors
        [...innerExpr.argList].forEach(function (factor) {
            // console.lg("testing the factor using is_real:", $.toInfixString(factor));
            if ($.isreal(factor)) {
                // console.lg("factor is real:", $.toInfixString(factor));
                rs.push(factor);
            }
            else {
                // console.lg("factor is NOT real:", $.toInfixString(factor));
                cs.push(factor);
            }
        });
        const A = multiply_factors(rs, $);
        // console.lg("A", $.toInfixString(A));
        const B = multiply_factors(cs, $);
        // console.lg("B", $.toInfixString(B));
        if (B.equals(innerExpr)) {
            // We didn't make any progress.
            // We must avoid infinite recursion.
            return [TFLAG_NONE, outerExpr];
        }
        // console.lg("exp", $.toInfixString(expr));
        const C = $.valueOf(items_to_cons(IM, B));
        // console.lg("C", $.toSExprString(C));
        const D = $.valueOf(items_to_cons(MUL, A, C));
        // console.lg("D", $.toSExprString(D));
        // console.lg("real of", $.toInfixString(expr), "is", $.toInfixString(D));

        return [TFLAG_DIFF, D];
    }
}

export const imag_mul = mkbuilder(Op);

function multiply_factors(factors: U[], $: ExtensionEnv): U {
    if (factors.length > 1) {
        return $.valueOf(items_to_cons(MUL, ...factors));
    }
    else if (factors.length === 1) {
        return $.valueOf(factors[0]);
    }
    else {
        return one;
    }
}
