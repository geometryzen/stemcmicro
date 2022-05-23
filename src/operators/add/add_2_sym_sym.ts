import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, SIGN_GT, SIGN_LT, TFLAG_HALT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * b + a => a + b
 * a + a => 2 * a
 */
class Op extends Function2<Sym, Sym> implements Operator<BCons<Sym, Sym, Sym>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_sym_sym', MATH_ADD, is_sym, is_sym, $);
        this.hash = hash_binop_atom_atom(MATH_ADD, HASH_SYM, HASH_SYM);
    }
    transform2(opr: Sym, lhs: Sym, rhs: Sym, orig: BCons<Sym, Sym, Sym>): [TFLAGS, U] {
        switch (compare_sym_sym(lhs, rhs)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, makeList(opr, rhs, lhs)];
            }
            case SIGN_LT: {
                return [TFLAG_HALT, orig];
            }
            default: {
                if (lhs.equals(rhs)) {
                    return [TFLAG_DIFF, makeList(MATH_MUL.clone(opr.pos, opr.end), two, lhs)];
                }
                else {
                    return [TFLAG_HALT, orig];
                }
            }
        }
    }
}

export const add_2_sym_sym = new Builder();
