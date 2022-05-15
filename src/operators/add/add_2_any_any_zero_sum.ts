import { is_zero_sum } from "../../calculators/factorize/is_zero_sum";
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { zero } from "../../tree/rat/Rat";
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

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        return is_zero_sum(lhs, rhs, $);
    };
}

class Op extends Function2X<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_any_any_zero_sum', MATH_ADD, is_any, is_any, cross($), $);
        this.hash = `(+ U U)`;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXPR): [TFLAGS, U] {
        return [CHANGED, zero];
    }
}

export const add_2_any_any_zero_sum = new Builder();
