import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_outer_2_sym_sym } from "../outer/is_outer_2_sym_sym";
import { is_mul_2_rat_sym } from "./is_mul_2_rat_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = BCons<Sym, Rat, Sym>;
type RHS = BCons<Sym, Sym, Sym>;
type EXPR = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        const a = lhs.rhs;
        const b = rhs.lhs;
        const c = rhs.rhs;
        return $.treatAsVector(a) && $.treatAsVector(b) && $.treatAsVector(c);
    };
}

/**
 * TODO: Not sure if this makes sense. It's a pseudo right-associating factors.
 * Why would this be desirable?
 * 
 * (k * a) * (b^c) => k * (a * (b^c))
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly breaker = true;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_rat_sym_outer_2_sym_sym', MATH_MUL, and(is_cons, is_mul_2_rat_sym), and(is_cons, is_outer_2_sym_sym), cross($), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: BCons<Sym, LHS, RHS>): [TFLAGS, U] {
        const k = lhs.lhs;
        const a = lhs.rhs;
        const abc = items_to_cons(MATH_MUL, a, rhs);
        return [TFLAG_DIFF, items_to_cons(MATH_MUL, k, abc)];
    }
}

// Not used because it causes a loop
export const mul_2_mul_2_rat_sym_outer_2_sym_sym = new Builder();
