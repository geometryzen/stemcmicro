
import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_pow_2_sym_any } from "../pow/is_pow_2_sym_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: BCons<Sym, Sym, U>, rhs: BCons<Sym, Sym, U>): boolean {
    const s1 = lhs.lhs;
    const s2 = rhs.lhs;
    return s1.equalsSym(s2);
}

/**
 * (x ** a) * (x ** b) =>  x ** (a + b) 
 */
class Op extends Function2X<BCons<Sym, Sym, U>, BCons<Sym, Sym, U>> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('mul_2_pow_2_xxx_any_pow_2_xxx_any', MATH_MUL, and(is_cons, is_pow_2_sym_any), and(is_cons, is_pow_2_sym_any), cross, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Sym, U>, rhs: BCons<Sym, Sym, U>): [TFLAGS, U] {
        const sym = lhs.lhs;
        const a = lhs.rhs;
        const b = rhs.rhs;
        const expo = makeList(MATH_ADD, a, b);
        const D = makeList(MATH_POW, sym, expo);
        return [CHANGED, D];
    }
}

export const mul_2_pow_2_xxx_any_pow_2_xxx_any = new Builder();
