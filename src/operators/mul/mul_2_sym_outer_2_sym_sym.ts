import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { negTwo, two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_outer_2_sym_sym } from "../outer/is_outer_2_sym_sym";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = BCons<Sym, Sym, Sym>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        return $.treatAsVector(lhs) && $.treatAsVector(rhs.lhs) && $.treatAsVector(rhs.rhs);
    };
}

/**
 * specifically designed to convert a*(b^c), considered non-canonical, to canonical form.
 * a*(b^c) => (b^c)*a + 2(a|b)*c-2(a|c)b, where a,b,c are vectors.
 */
class Op extends Function2X<LHS, RHS> implements Operator<BCons<Sym, LHS, RHS>> {
    readonly name = 'mul_2_sym_outer_2_sym_sym';
    constructor($: ExtensionEnv) {
        super('mul_2_sym_outer_2_sym_sym', MATH_MUL, is_sym, and(is_cons, is_outer_2_sym_sym), cross($), $);
    }
    cost(expr: BCons<Sym, LHS, RHS>, costs: CostTable, depth: number): number {
        return super.cost(expr, costs, depth) + 1;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const a = lhs;
        const b = rhs.lhs;
        const c = rhs.rhs;
        const ab = makeList(MATH_INNER, a, b);
        const bc = makeList(MATH_OUTER, b, c);
        const ca = makeList(MATH_INNER, c, a);
        const abc = makeList(MATH_MUL, two, ab, c);
        const bca = makeList(MATH_MUL, bc, a);
        const cab = makeList(MATH_MUL, negTwo, ca, b);
        return [CHANGED, makeList(MATH_ADD, abc, bca, cab)];
    }
}

export const mul_2_sym_outer_2_sym_sym = new Builder();
