import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { MATH_DERIVATIVE } from "../derivative/MATH_DERIVATIVE";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_mul_2_any_cons } from "./is_mul_2_any_cons";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

function crossGuard($: ExtensionEnv) {
    return function (lhs: Cons2<Sym, U, Cons>, rhs: Sym): boolean {
        // console.lg(`lhs: ${render_as_infix(lhs, $)}, rhs=${render_as_infix(rhs, $)}`);
        // console.lg(`lhs.RHS: ${render_as_infix(lhs.rhs, $)}, rhs=${render_as_infix(rhs, $)}`);
        const candidate = lhs.rhs.opr;
        if (is_sym(candidate) && candidate.equalsSym(MATH_DERIVATIVE)) {
            return $.isscalar(rhs);
        }
        else {
            return false;
        }
    };
}


/**
 *
 */
class Op extends Function2X<Cons2<Sym, U, Cons>, Sym> implements Operator<Cons2<Sym, Cons2<Sym, U, Cons>, Sym>> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_mul_2_any_cons_sym', MATH_MUL, and(is_cons, is_mul_2_any_cons), is_sym, crossGuard($), $);
        this.#hash = hash_binop_cons_atom(MATH_MUL, MATH_MUL, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Cons2<Sym, U, Cons>, rhs: Sym/*, orig: BCons<Sym, BCons<Sym, U, Cons>, Sym>*/): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(`lhs: ${render_as_infix(lhs, $)}, rhs=${render_as_infix(rhs, $)}`);
        const a = lhs.lhs;
        const deriv = lhs.rhs;
        const sym = rhs;
        const a_times_sym = $.valueOf(items_to_cons(MATH_MUL, a, sym));
        const a_times_sym_times_deriv = $.valueOf(items_to_cons(MATH_MUL, a_times_sym, deriv));

        return [TFLAG_DIFF, a_times_sym_times_deriv];
    }
}

export const mul_2_mul_2_any_cons_sym = new Builder();
