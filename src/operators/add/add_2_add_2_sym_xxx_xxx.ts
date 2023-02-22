import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
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

type LHS = BCons<Sym, Sym, Sym>;
type RHS = Sym;
type EXP = BCons<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    const x1 = lhs.rhs;
    const x2 = rhs;
    return x1.equalsSym(x2);
}

/**
 * (a + b) + b => a + (2 * b)
 */
class Op extends Function2X<BCons<Sym, Sym, Sym>, Sym> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_sym_xxx_xxx', MATH_ADD, and(is_cons, is_add_2_sym_sym), is_sym, cross, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_SYM);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.isExpanding()) {
            const A = lhs.lhs;
            const B = rhs;
            const C = items_to_cons(MATH_MUL, two, B);
            const E = items_to_cons(opr, A, C);
            return [TFLAG_DIFF, E];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const add_2_add_2_sym_xxx_xxx = new Builder();
