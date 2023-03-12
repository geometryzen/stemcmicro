import { count_factors } from "../../calculators/count_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF } from "../../tree/boo/Boo";
import { assert_rat } from "../../tree/rat/assert_rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { UCons } from "../helpers/UCons";
import { AbstractChain } from "../isreal/AbstractChain";
import { is_rat } from "../rat/is_rat";

const not_is_rat = (expr: U) => !is_rat(expr);

const rect = native_sym(Native.rect);
const mul = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * rect(Rat*z) => rect(Rat * rect(z))
 */
class Op extends AbstractChain {
    constructor($: ExtensionEnv) {
        super(rect, mul, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            // console.lg("expr", expr.toString());
            const mulExpr = expr.argList.head;
            return count_factors(mulExpr, is_rat) == 1;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, expr: UCons<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        // console.lg("innerExpr", this.$.toInfixString(innerExpr));
        const lhs = assert_rat(remove_factors(innerExpr, not_is_rat));
        const rhs = remove_factors(innerExpr, is_rat);
        // console.lg("lhs", this.$.toInfixString(lhs));
        // console.lg("rhs", this.$.toInfixString(rhs));
        const rect_z = $.valueOf(items_to_cons(rect, rhs));
        const rat_times_rect_z = $.valueOf(items_to_cons(mul, lhs,  rect_z));

        return [TFLAG_DIFF, rat_times_rect_z];
    }
}

export const rect_mul_rat_any = new Builder();
