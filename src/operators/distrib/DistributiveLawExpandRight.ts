
import { ExtensionEnv, MODE_EXPANDING, Operator, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { is_cons_opr_eq_sym } from "../../predicates/is_cons_opr_eq_sym";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = Cons;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

function make_is_cons_and_opr_eq_sym(lower: Sym) {
    return function (expr: U): expr is Cons {
        return is_cons(expr) && is_cons_opr_eq_sym(expr, lower);
    };
}

/**
 * (upper (lower x1 x2 x3 ...) Z)
 */
export class DistributiveLawExpandRight extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    readonly phases = MODE_EXPANDING;
    constructor($: ExtensionEnv, upper: Sym, lower: Sym) {
        super(`${upper} right-distributive over ${lower}`, upper, make_is_cons_and_opr_eq_sym(lower), is_any, $);
        this.hash = hash_binop_cons_atom(upper, lower, HASH_ANY);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(upper: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        const lower = lhs.opr;
        const Z = rhs;
        const xs = lhs.tail();
        const terms = xs.map(function (x) {
            return $.valueOf(items_to_cons(upper, x, Z));
        });
        const retval = $.valueOf(items_to_cons(lower, ...terms));
        return [TFLAG_DIFF, retval];
    }
}
