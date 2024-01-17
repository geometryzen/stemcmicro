import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_blade_rat } from "../mul/is_mul_2_blade_rat";
import { is_mul_2_rat_blade } from "../mul/is_mul_2_rat_blade";
import { is_rat } from "../rat/rat_extension";
import { MATH_VECTOR_CROSS_PRODUCT } from "./MATH_VECTOR_CROSS_PRODUCT";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = Blade;
type RHS = Blade;
type EXP = BCons<Sym, LHS, RHS>;

/**
 * cross(A,B) = -1 * dual(A^B), were '^' denotes the outer product of vectors.
 */
class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Blade'];
    constructor($: ExtensionEnv) {
        super('cross_blade_blade', MATH_VECTOR_CROSS_PRODUCT, is_blade, is_blade, $);
        this.#hash = hash_binop_atom_atom(MATH_VECTOR_CROSS_PRODUCT, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const wedge = $.valueOf(lhs.wedge(rhs));
        if (is_blade(wedge)) {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_MUL, negOne, wedge.dual()))];
        }
        if (is_rat(wedge)) {
            return [TFLAG_DIFF, wedge];
        }
        if (is_cons(wedge) && is_mul_2_blade_rat(wedge)) {
            const bld = wedge.lhs;
            const num = wedge.rhs;
            return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_MUL, negOne.mul(num), bld.dual()))];
        }
        if (is_cons(wedge) && is_mul_2_rat_blade(wedge)) {
            const num = wedge.lhs;
            const bld = wedge.rhs;
            return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_MUL, negOne.mul(num), bld.dual()))];
        }
        // More generally, we should extract the blade from the factors and treat the remaning factors as scalars.
        // Other possibilities...
        // Rat * Blade
        // Num * Blade
        throw new Error(`${$.toSExprString(wedge)}`);
    }
}

export const cross_blade_blade = new Builder();
