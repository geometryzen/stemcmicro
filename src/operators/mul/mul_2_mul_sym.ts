import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_mul } from "./is_mul";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (* (* X1 X2 X3) a) => (* X1 X2 X3) 
 */
class Op extends Function2<Cons, Sym> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_sym', MATH_MUL, and(is_cons, is_mul), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: Cons, rhs: Sym, expr: BCons<Sym, Cons, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.implicateMode) {
            return [CHANGED, makeList(...lhs, rhs)];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_mul_sym = new Builder();
