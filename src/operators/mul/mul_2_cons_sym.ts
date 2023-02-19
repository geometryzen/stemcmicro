
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { MATH_DERIVATIVE } from "../derivative/MATH_DERIVATIVE";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * Cons * Sym => Sym * Cons
 */
class Op extends Function2<Cons, Sym> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_cons_sym', MATH_MUL, is_cons, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_MUL, HASH_ANY, HASH_SYM);
        // console.lg(`hash=${JSON.stringify(this.hash)}`);
    }
    transform2(opr: Sym, lhs: Cons, rhs: Sym, expr: BCons<Sym, Cons, Sym>): [TFLAGS, U] {
        const $ = this.$;
        const oprLHS = lhs.opr;
        if (is_sym(oprLHS) && oprLHS.equalsSym(MATH_DERIVATIVE) && $.isScalar(rhs)) {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const mul_2_cons_sym = new Builder();

