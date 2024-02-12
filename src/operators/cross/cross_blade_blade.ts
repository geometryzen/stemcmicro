import { Blade, is_blade } from "math-expression-atoms";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
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
type EXP = Cons2<Sym, LHS, RHS>;

function eval_cross_blade_blade(expr: EXP, $: ExtensionEnv): U {
    const bladeL = expr.lhs;
    const bladeR = expr.rhs;
    try {
        return cross_blade_blade(bladeL, bladeR, $);
    }
    finally {
        bladeL.release();
        bladeR.release();
    }
}

function cross_blade_blade(lhs: Blade, rhs: Blade, $: ExtensionEnv): U {
    const wedge = $.valueOf(lhs.wedge(rhs));
    if (is_blade(wedge)) {
        return $.valueOf(items_to_cons(MATH_MUL, negOne, wedge.dual()));
    }
    if (is_rat(wedge)) {
        return wedge;
    }
    if (is_cons(wedge) && is_mul_2_blade_rat(wedge)) {
        const bld = wedge.lhs;
        const num = wedge.rhs;
        return $.valueOf(items_to_cons(MATH_MUL, negOne.mul(num), bld.dual()));
    }
    if (is_cons(wedge) && is_mul_2_rat_blade(wedge)) {
        const num = wedge.lhs;
        const bld = wedge.rhs;
        return $.valueOf(items_to_cons(MATH_MUL, negOne.mul(num), bld.dual()));
    }
    // More generally, we should extract the blade from the factors and treat the remaning factors as scalars.
    // Other possibilities...
    // Rat * Blade
    // Num * Blade
    throw new Error(`${$.toSExprString(wedge)}`);
}

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
    valueOf(expr: EXP): U {
        return eval_cross_blade_blade(expr, this.$);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const $ = this.$;
        const retval = cross_blade_blade(lhs, rhs, $);
        if (retval.equals(expr)) {
            return [TFLAG_NONE, retval];
        }
        else {
            return [TFLAG_DIFF, retval];
        }
    }
}

export const cross_blade_blade_builder = new Builder();
