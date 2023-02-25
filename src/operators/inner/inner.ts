
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
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
        // console.lg("ENTERING", this.name, decodeMode($.getMode()), render_as_infix(expr, this.$));
        const hook = (where: string, retval: U): U => {
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_infix(orig, this.$), "=>", render_as_infix(retval, $));
            // console.lg("HOOK ....:", this.name, where, decodeMode($.getMode()), render_as_sexpr(expr, this.$), "=>", render_as_sexpr(retval, $));
            return retval;
        };
        if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
            // This will become infinite recursion if both sides are blades.
            if (is_blade(lhs) && is_blade(rhs)) {
                return [TFLAG_NONE, hook('A', orig)];
            }
            else {
                const bladeL = extract_single_blade(lhs);
                // console.lg("bladeL", render_as_infix(bladeL,$));
                const residueL = remove_factors(lhs, is_blade);
                // console.lg("residueL", render_as_infix(residueL,$));
                const bladeR = extract_single_blade(rhs);
                // console.lg("bladeR", render_as_infix(bladeR,$));
                const residueR = remove_factors(rhs, is_blade);
                // console.lg("residueR", render_as_infix(residueR,$));
                const A = $.valueOf(items_to_cons(opr, residueL, residueR));
                // console.lg("A", render_as_infix(A,$));
                const B = $.valueOf(items_to_cons(opr, bladeL, bladeR));
                const C = $.valueOf(items_to_cons(MATH_MUL, A, B));
                return [TFLAG_DIFF, hook('B', C)];
            }
        }
        else {
            const M = $.valueOf(items_to_cons(MATH_MUL, lhs, rhs));
            return [TFLAG_NONE, hook('C', M)];
        }
    }
}

export const inner_extension = new Builder();
