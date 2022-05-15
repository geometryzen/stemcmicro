import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, STABLE, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_POW } from "../../runtime/ns_math";
import { is_rat } from "../../tree/rat/is_rat";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Rat;
type EXPR = BCons<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('pow_2_sym_rat', MATH_POW, is_sym, is_rat, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: EXPR): boolean {
        return true;
    }
    isScalar(expr: EXPR): boolean {
        const base = expr.lhs;
        // TODO: If the symbol was a vector, and it was squared then it might be a scalar.
        return this.$.isScalar(base);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: EXPR): boolean {
        return false;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        // No change in arguments
        if (rhs.isOne()) {
            return [CHANGED, lhs];
        }
        else {
            return [STABLE, expr];
        }
    }
}

export const pow_2_sym_rat = new Builder();
