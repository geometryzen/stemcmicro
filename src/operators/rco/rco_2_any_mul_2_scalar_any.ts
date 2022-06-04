import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { MATH_MUL, MATH_RCO } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * x >> (a * y) => a * (x >> y)
 */
class Op extends Function2<U, BCons<Sym, U, U>> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('rco_2_any_mul_2_scalar_any', MATH_RCO, is_any, is_mul_2_scalar_any($), $);
        this.hash = hash_binop_atom_cons(MATH_RCO, HASH_ANY, MATH_MUL);
    }
    transform2(opr: Sym, lhs: U, rhs: BCons<Sym, U, U>): [TFLAGS, U] {
        const $ = this.$;
        const x = lhs;
        const a = rhs.lhs;
        const y = rhs.rhs;
        const xy = $.valueOf(items_to_cons(opr, x, y));
        const retval = $.valueOf(items_to_cons(rhs.opr, a, xy));
        return [TFLAG_DIFF, retval];
    }
}

export const rco_2_any_mul_2_scalar_any = new Builder();
