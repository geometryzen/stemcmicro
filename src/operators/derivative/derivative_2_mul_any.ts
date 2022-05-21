import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { subst } from "../../subst";
import { Hyp } from "../../tree/hyp/Hyp";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_opr_2_any_any } from "../helpers/is_opr_2_any_any";
import { MATH_STANDARD_PART } from "../st/MATH_STANDARD_PART";
import { is_sym } from "../sym/is_sym";
import { MATH_DERIVATIVE } from "./MATH_DERIVATIVE";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, U, U>;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * (derivative (multiply F G) X)
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('derivative_2_mul_any', MATH_DERIVATIVE, and(is_cons, is_opr_2_any_any(MATH_MUL)), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_DERIVATIVE, MATH_MUL, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
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
        return [changed ? CHANGED : NOFLAGS, p5];
    }
}

export const derivative_2_mul_any = new Builder();
