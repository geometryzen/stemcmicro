import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { half } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { CompositeOperator } from "../CompositeOperator";
import { simplify } from "../simplify/simplify";

const abs = native_sym(Native.abs);
const add = native_sym(Native.add);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * 
 */
class Op extends CompositeOperator {
    constructor($: ExtensionEnv) {
        super(abs, add, $);
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const addExpr = expr.argList.head;
            const terms: U[] = addExpr.tail();
            return terms.some(contains_single_blade);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, innerExpr: Cons, outerExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, this.$.toInfixString(innerExpr));
        const retval = $.valueOf(simplify($.power($.inner(innerExpr, innerExpr), half), $));
        return [TFLAG_DIFF, retval];
    }
}

export const abs_add_blades = new Builder();
