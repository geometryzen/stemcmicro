import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_add_2_sym_sym } from "./is_add_2_sym_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function cross(lhs: BCons<Sym, Sym, Sym>, rhs: Sym): boolean {
    const x1 = lhs.rhs;
    const x2 = rhs;
    return x1.equalsSym(x2);
}

/**
 * (a + b) + b => a + (2 * b)
 */
class Op extends Function2X<BCons<Sym, Sym, Sym>, Sym> implements Operator<Cons> {
    constructor($: ExtensionEnv) {
        super('add_2_add_2_sym_xxx_xxx', MATH_ADD, and(is_cons, is_add_2_sym_sym), is_sym, cross, $);
    }
    transform2(opr: Sym, lhs: BCons<Sym, Sym, Sym>, rhs: Sym): [TFLAGS, U] {
        const A = lhs.lhs;
        const B = rhs;
        const C = makeList(MATH_MUL, two, B);
        const E = makeList(opr, A, C);
        return [CHANGED, E];
    }
}

export const add_2_add_2_sym_xxx_xxx = new Builder();
