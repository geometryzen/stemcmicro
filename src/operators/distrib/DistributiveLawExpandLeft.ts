
import { Sym } from "math-expression-atoms";
import { Cons, Cons2, is_cons, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, MODE_EXPANDING, Operator, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = Cons;
type EXPR = Cons2<Sym, LHS, RHS>;

function make_is_cons_and_opr_eq_sym(lower: Sym) {
    return function (expr: U): expr is Cons {
        return is_cons(expr) && is_cons_opr_eq_sym(expr, lower);
    };
}

/**
 * (upper lhs (lower x1 x2 x3)) => (lower (upper lhs x1) (upper lhs x2) (upper lhs x3) ...)
 */
export class DistributiveLawExpandLeft extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv, upper: Sym, lower: Sym) {
        super(`${upper.key()} left-distributive over ${lower.key()}`, upper, is_any, make_is_cons_and_opr_eq_sym(lower), $);
        this.#hash = hash_binop_atom_cons(upper, HASH_ANY, lower);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(upper: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        const lower = rhs.opr;
        const xs = rhs.tail();
        const terms = xs.map(function (x) {
            return $.valueOf(items_to_cons(upper, lhs, x));
        });
        const retval = $.valueOf(items_to_cons(lower, ...terms));
        return [TFLAG_DIFF, retval];
    }
}
