import { CostTable } from "../../env/CostTable";
import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add } from "./is_add";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Cons;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

/**
 * (+ (+ a1 a2 a3 ...) b) => (+ a1 a2 a3 ... b) 
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_any', MATH_ADD, and(is_cons, is_add), is_any, $);
        this.hash = '(+ (+) U)';
    }
    cost(expr: EXPR, costTable: CostTable, depth: number): number {
        // The extra cost for '+' proportional to depth is to encourage distribution law over addition expansion.
        return super.cost(expr, costTable, depth) + costTable.getCost(MATH_ADD, this.$) * depth;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if ($.implicateMode) {
            return [CHANGED, makeList(MATH_ADD, ...lhs.tail(), rhs)];
        }
        return [NOFLAGS, orig];
    }
}

export const add_2_add_any = new Builder();
