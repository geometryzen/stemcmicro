import { ExtensionEnv, MODE_EXPANDING, MODE_IMPLICATE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_add } from "./is_add";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Cons, U> implements Operator<Cons> {
    readonly hash: string;
    readonly phases = MODE_IMPLICATE | MODE_EXPANDING;
    constructor($: ExtensionEnv) {
        super('add_2_add_any', MATH_ADD, and(is_cons, is_add), is_any, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_ANY);
    }
    transform2(opr: Sym, lhs: Cons, rhs: U, expr: Cons): [TFLAGS, U] {
        const $ = this.$;
        if ($.isImplicating()) {
            return [TFLAG_DIFF, items_to_cons(opr, ...lhs.tail(), rhs)];
        }
        else {
            if ($.isAssociationImplicit()) {
                return [TFLAG_DIFF, items_to_cons(opr, ...lhs.tail(), rhs)];
            }
            else {
                return [TFLAG_NONE, expr];
            }
        }
    }
}

export const add_2_add_any = new Builder();
