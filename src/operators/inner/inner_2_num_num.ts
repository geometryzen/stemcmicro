
import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { is_num } from "../../predicates/is_num";
import { MATH_INNER } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Num | Num => Num * Num
 */
class Op extends Function2<Num, Num> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('inner_2_num_num', MATH_INNER, is_num, is_num, $);
    }
    transform2(opr: Sym, lhs: Num, rhs: Num): [TFLAGS, U] {
        return [TFLAG_DIFF, multiply_num_num(lhs, rhs)];
    }
}

export const inner_2_num_num = new Builder();
