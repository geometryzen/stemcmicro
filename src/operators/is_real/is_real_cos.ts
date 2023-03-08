import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { PREDICATE_IS_REAL } from "../../runtime/constants";
import { wrap_as_boo } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { AbstractPredicateCons } from "./AbstractPredicateCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new IsRealCos($);
    }
}

class IsRealCos extends AbstractPredicateCons {
    constructor($: ExtensionEnv) {
        super(PREDICATE_IS_REAL, MATH_COS, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, cosExpr: Cons): [TFLAGS, U] {
        const $ = this.$;
        const x = cosExpr.argList.head;
        return [TFLAG_DIFF, wrap_as_boo($.isReal(x))];
    }
}

export const is_real_cos = new Builder();
