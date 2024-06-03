import { Blade, is_blade, is_rat } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Cons2, is_cons, items_to_cons, U } from "@stemcmicro/tree";
import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { negOne } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_blade_rat } from "../mul/is_mul_2_blade_rat";
import { is_mul_2_rat_blade } from "../mul/is_mul_2_rat_blade";
import { MATH_VECTOR_CROSS_PRODUCT } from "./MATH_VECTOR_CROSS_PRODUCT";

class Builder implements ExtensionBuilder<U> {
    create(): Extension<U> {
        return new Op();
    }
}

type LHS = Blade;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

function eval_cross_blade_blade(expr: EXP, $: ExprContext): U {
    const bladeL = expr.lhs;
    const bladeR = expr.rhs;
    try {
        return cross_blade_blade(bladeL, bladeR, $);
    } finally {
        bladeL.release();
        bladeR.release();
    }
}

function cross_blade_blade(lhs: Blade, rhs: Blade, $: ExprContext): U {
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
    throw new Error();
}

/**
 * cross(A,B) = -1 * dual(A^B), were '^' denotes the outer product of vectors.
 */
class Op extends Function2<LHS, RHS> implements Extension<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Blade"];
    constructor() {
        super("cross_blade_blade", MATH_VECTOR_CROSS_PRODUCT, is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_VECTOR_CROSS_PRODUCT, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP, $: ExtensionEnv): U {
        return eval_cross_blade_blade(expr, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = cross_blade_blade(lhs, rhs, $);
        if (retval.equals(expr)) {
            return [TFLAG_NONE, retval];
        } else {
            return [TFLAG_DIFF, retval];
        }
    }
}

export const cross_blade_blade_builder = new Builder();
