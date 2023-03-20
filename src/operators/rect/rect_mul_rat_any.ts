import { count_factors } from "../../calculators/count_factors";
import { remove_factors } from "../../calculators/remove_factors";
import { Directive, ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { assert_rat } from "../../tree/rat/assert_rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { CompositeOperator } from "../CompositeOperator";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";

const not_is_rat = (expr: U) => !is_rat(expr);

const RECT = native_sym(Native.rect);
const MUL = native_sym(Native.multiply);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * rect(Rat*z) => rect(Rat * rect(z))
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(RECT, MUL, $);
    }
    isKind(expr: U): expr is UCons<Sym, Cons> {
        if (super.isKind(expr)) {
            // console.lg("expr", expr.toString());
            const mulExpr = expr.argList.head;
            return count_factors(mulExpr, is_rat) === 1;
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, expr: UCons<Sym, Cons>): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const lhs = assert_rat(remove_factors(innerExpr, not_is_rat));
        const rhs = remove_factors(innerExpr, is_rat);
        // console.lg("lhs", this.$.toInfixString(lhs));
        // console.lg("rhs", this.$.toInfixString(rhs));
        const rect_z = $.rect(rhs);
        $.pushDirective(Directive.convertExpToTrig, true);
        try {
            return [TFLAG_DIFF, $.multiply(lhs, rect_z)];
        }
        finally {
            $.popDirective();
        }
    }
}

export const rect_mul_rat_any = new Builder();
