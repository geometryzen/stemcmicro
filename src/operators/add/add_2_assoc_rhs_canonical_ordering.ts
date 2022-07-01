import { compare_terms } from "../../calculators/compare/compare_terms";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_cons } from "../../hashing/hash_info";
import { makeList } from "../../makeList";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";
import { is_add } from "./is_add";
import { is_add_2_any_any } from "./is_add_2_any_any";

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
        if (is_cons(lhs) && is_add(lhs)) {
            return false;
        }
        else {
            const sign = compare_terms(lhs, rhs.lhs, $);
            // console.log(`add_2_assoc_rhs_canonical_ordering lhs=${render_as_infix(lhs, $)} rhs.lhs=${render_as_infix(rhs.lhs, $)} sign=${sign}`);
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
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        const $ = this.$;
        const a = rhs.lhs;
        const X = rhs.rhs;
        const z = lhs;
        const p1 = makeList(MATH_ADD, z, X);
        const p2 = $.valueOf(p1);
        const p3 = makeList(MATH_ADD, a, p2);
        const p4 = $.valueOf(p3);
        return [TFLAG_DIFF, p4];
    }
}

export const add_2_assoc_rhs_canonical_ordering = new Builder();
