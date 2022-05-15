import { do_factorize_rhs } from "../../calculators/factorize/do_factorize_rhs";
import { is_factorize_rhs } from "../../calculators/factorize/is_factorize_rhs";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { one } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RHS = U;
type EXPR = BCons<Sym, LHS, RHS>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        if ($.isFactoring()) {
            return is_factorize_rhs(lhs, rhs);
        }
        else {
            return false;
        }
    };
}

class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    constructor($: ExtensionEnv) {
        super('add_2_any_any_factorize_rhs', MATH_ADD, is_any, is_any, cross($), $);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        const $ = this.$;
        return do_factorize_rhs(lhs, rhs, one, expr, $);
    }
}

export const add_2_any_any_factorize_rhs = new Builder();
