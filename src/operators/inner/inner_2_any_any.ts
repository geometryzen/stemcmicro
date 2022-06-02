
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { MATH_INNER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<U, U> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_any_any', MATH_INNER, is_any, is_any, $);
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: BCons<Sym, U, U>): [TFLAGS, U] {
        // console.log(`${this.name} lhs=${lhs} rhs=${rhs}`);
        return [TFLAG_NONE, expr];
    }
}

export const inner_2_any_any = new Builder();
