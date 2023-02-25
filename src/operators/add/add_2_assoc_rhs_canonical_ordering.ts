import { cmp_terms } from "../../calculators/compare/comparator_add";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_add_2_any_any } from "./is_add_2_any_any";
import { is_cons_opr_eq_add } from "./is_cons_opr_eq_add";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = U;
type RL = U;
type RR = U;
type RHS = BCons<Sym, RL, RR>;
type EXP = BCons<Sym, LHS, RHS>;

function cross($: ExtensionEnv) {
    return function (lhs: LHS, rhs: RHS): boolean {
        // If the left hand side is an addition then the ordering will be indeterminate.
        if (is_cons(lhs) && is_cons_opr_eq_add(lhs)) {
            return false;
        }
        else {
            const sign = cmp_terms(lhs, rhs.lhs, $);
            // console.lg(`add_2_assoc_rhs_canonical_ordering lhs=${render_as_infix(lhs, $)} rhs.lhs=${render_as_infix(rhs.lhs, $)} sign=${sign}`);
            return sign > 0;
        }
    };
}

/**
 * z + (a + X) => a + (z + X)
 */
class Op extends Function2X<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_assoc_rhs_canonical_ordering', MATH_ADD, is_any, and(is_cons, is_add_2_any_any), cross($), $);
        this.hash = hash_binop_atom_cons(MATH_ADD, HASH_ANY, MATH_ADD);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        // const $ = this.$;
        // console.lg(this.name, decodeMode($.getMode()), render_as_sexpr(expr, this.$));
        const hook = (where: string, retval: U): U => {
            // console.lg(this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        // console.lg(this.name, render_as_infix(exp, $));
        const a = rhs.lhs;
        const X = rhs.rhs;
        const z = lhs;
        const p1 = items_to_cons(MATH_ADD, z, X);
        const p3 = items_to_cons(MATH_ADD, a, p1);
        return [TFLAG_DIFF, hook('A', p3)];
    }
}

export const add_2_assoc_rhs_canonical_ordering = new Builder();
