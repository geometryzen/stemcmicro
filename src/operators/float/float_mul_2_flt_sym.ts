import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function1 } from "../helpers/Function1";
import { value_of } from "../helpers/valueOf";
import { is_mul_2_flt_sym } from "../mul/is_mul_2_flt_sym";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<BCons<Sym, Flt, Sym>> implements Operator<U> {
    constructor($: ExtensionEnv) {
        super('float_mul_2_flt_sym', new Sym('float'), and(is_cons, is_mul_2_flt_sym), $);
    }
    transform1(opr: Sym, arg: BCons<Sym, Flt, Sym>): [TFLAGS, U] {
        const lhs = arg.lhs;
        const rhs = value_of(arg.rhs, this.$);
        return [CHANGED, value_of(makeList(MATH_MUL, lhs, rhs), this.$)];
    }
}

export const float_mul_2_flt_sym = new Builder();
