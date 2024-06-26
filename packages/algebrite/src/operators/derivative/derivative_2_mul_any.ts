import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { dproduct } from "./helpers/dproduct";

type LHS = Cons2<Sym, U, U>;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (derivative F X) where F is (* f g)
 *
 * TODO: This should now be covered elsewhere.
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("derivative_2_mul_any", native_sym(Native.derivative), and(is_cons, is_opr_2_any_any(MATH_MUL)), is_sym);
        this.#hash = hash_binop_cons_atom(this.opr, MATH_MUL, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = dproduct(lhs, rhs, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
        /*
        // Here, we evaluate the derivative using nonstandard analyis.
        // https://en.wikipedia.org/wiki/Nonstandard_analysis 
        const X = rhs;
        const p0 = new Hyp(`d${X}`, X.pos, X.end);
        const p1 = subst(lhs, X, makeList(MATH_ADD, X, p0), $);
        const p2 = $.negate(lhs);
        const p3 = makeList(MATH_ADD, p1, p2);
        const p4 = $.divide(p3, p0);
        const p5 = $.valueOf(makeList(MATH_STANDARD_PART, p4));
        const changed = true;
        // The following implementaion encodes the chain rule.
        // const retval = dproduct(lhs, X, $);
        // const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : NOFLAGS, p5];
        */
    }
}

export const derivative_2_mul_any = mkbuilder(Op);

export function non_standard_analysis_derivative(F: U, X: U, $: ExtensionEnv): U {
    // Here, we evaluate the derivative using nonstandard analyis.
    // https://en.wikipedia.org/wiki/Nonstandard_analysis
    const dX = new Hyp(`d${X}`, X.pos, X.end);
    const X_plus_dX = $.add(X, dX);
    const F_plus_dF = $.subst(X_plus_dX, X, F);
    const dF = $.subtract(F_plus_dF, F);
    return $.st($.divide(dF, dX));
}
