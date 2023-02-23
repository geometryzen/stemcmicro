
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { render_as_infix } from "../../print/print";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { items_to_cons, U } from "../../tree/tree";
import { is_blade } from "../blade/is_blade";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Inner($);
    }
}
type LHS = U;
type RHS = U;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * The inner product is not associative (where you put the parens matters).
 * So it only makes sense to implement a strictly binary operator.
 */
class Inner extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('inner_extension', MATH_INNER, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(MATH_INNER, HASH_ANY, HASH_ANY);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(this.name, "lhs", render_as_infix(lhs, $), "rhs", render_as_infix(rhs, $));
        if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
            // This will become infinite recursion if both sides are blades.
            if (is_blade(lhs) && is_blade(rhs)) {
                return [TFLAG_NONE, orig];
            }
            else {
                const bladeL = extract_single_blade(lhs);
                const residueL = remove_factors(lhs, is_blade);
                const bladeR = extract_single_blade(rhs);
                const residueR = remove_factors(rhs, is_blade);
                const A = $.valueOf(items_to_cons(opr, residueL, residueR));
                const B = $.valueOf(items_to_cons(opr, bladeL, bladeR));
                const C = $.valueOf(items_to_cons(MATH_MUL, A, B));
                return [TFLAG_DIFF, C];
            }
        }
        else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const inner_extension = new Builder();
