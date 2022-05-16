import { CHANGED, ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul } from "./is_mul";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * (* (* a1 a2 a3 ...) b) => (* a1 a2 a3 ... b) 
 */
class Op extends Function2<Cons, U> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_any', MATH_MUL, and(is_cons, is_mul), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_ANY);
    }
    transform2(opr: Sym, lhs: Cons, rhs: U, expr: BCons<Sym, Cons, U>): [TFLAGS, U] {
        const $ = this.$;
        if ($.implicateMode) {
            return [CHANGED, makeList(MATH_MUL, ...lhs.tail(), rhs)];
        }
        return [NOFLAGS, expr];
    }
}

export const mul_2_mul_any = new Builder();
