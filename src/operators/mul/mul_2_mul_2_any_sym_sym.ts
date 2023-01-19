import { compare_sym_sym } from "../../calculators/compare/compare_sym_sym";
import { ExtensionEnv, Operator, OperatorBuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { two } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_sym } from "./is_mul_2_any_sym";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function crossGuard($: ExtensionEnv) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: BCons<Sym, U, Sym>, rhs: Sym): boolean {
        return true;
    };
}


/**
 * (X * z) * a => (X * a) * z
 * More fundamentally,
 * (X * z) * a => X * (z * a) => X * (a * z) => (X * a) * z
 */
class Op extends Function2X<BCons<Sym, U, Sym>, Sym> implements Operator<BCons<Sym, BCons<Sym, U, Sym>, Sym>> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_sym_sym', MATH_MUL, and(is_cons, is_mul_2_any_sym), is_sym, crossGuard($), $);
        this.hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    transform2(opr: Sym, lhs: BCons<Sym, U, Sym>, rhs: Sym, orig: BCons<Sym, BCons<Sym, U, Sym>, Sym>): [TFLAGS, U] {
        const $ = this.$;
        if ($.isAssocL(MATH_MUL)) {
            const X = lhs.lhs;
            const z = lhs.rhs;
            const a = rhs;
            // console.lg(`X=>${render_as_infix(X, $)}`);
            // console.lg(`z=>${render_as_infix(z, $)}`);
            // console.lg(`a=>${render_as_infix(a, $)}`);
            if ($.isScalar(z) || $.isScalar(a)) {
                switch (compare_sym_sym(z, a)) {
                    case SIGN_GT: {
                        const Xa = $.valueOf(items_to_cons(opr, X, a));
                        const Xaz = $.valueOf(items_to_cons(lhs.opr, Xa, z));
                        return [TFLAG_DIFF, Xaz];
                    }
                    case SIGN_EQ: {
                        // console.lg(`X=>${render_as_infix(X, $)}`);
                        // console.lg(`z=>${render_as_infix(z, $)}`);
                        // console.lg(`a=>${render_as_infix(a, $)}`);
                        // console.lg(`isExplicating=>${$.isExplicating()}`);
                        // console.lg(`isExpanding=>${$.isExpanding()}`);
                        // console.lg(`isImplicating=>${$.isImplicating()}`);
                        if ($.isExplicating()) {
                            return [TFLAG_NONE, orig];
                        }
                        else if ($.isExpanding()) {
                            return [TFLAG_NONE, orig];
                        }
                        else if ($.isFactoring()) {
                            const a_times_a = $.valueOf(items_to_cons(MATH_POW, a, two));
                            const Xaa = $.valueOf(items_to_cons(MATH_MUL, X, a_times_a));
                            return [TFLAG_DIFF, Xaa];
                        }
                        else if ($.isImplicating()) {
                            return [TFLAG_NONE, orig];
                        }
                        else {
                            return [TFLAG_NONE, orig];
                        }
                    }
                    default: {
                        return [TFLAG_NONE, orig];
                    }
                }
            }
            else {
                return [TFLAG_NONE, orig];
            }
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const mul_2_mul_2_any_sym_sym = new Builder();
