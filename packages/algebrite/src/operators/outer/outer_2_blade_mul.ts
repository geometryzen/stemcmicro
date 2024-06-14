import { Blade, is_blade, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { contains_single_blade, extract_single_blade, multiply, remove_factors } from "@stemcmicro/helpers";
import { Cons0, Cons2, U } from "@stemcmicro/tree";
import { mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, hash_nonop_cons } from "../../hashing/hash_info";
import { is_multiply } from "../../runtime/helpers";
import { MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { wrap_as_transform } from "../wrap_as_transform";

type LHS = Blade;
type RHS = Cons0<Sym>;
type EXP = Cons2<Sym, LHS, RHS>;

const HASH = hash_binop_atom_atom(MATH_OUTER, HASH_BLADE, hash_nonop_cons(MATH_MUL));

/**
 * Blade ^ (* ...)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor() {
        super(HASH, MATH_OUTER, is_blade, is_multiply);
        this.#hash = HASH;
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, oldExpr: EXP, env: ExprContext): [TFLAGS, U] {
        if (contains_single_blade(rhs)) {
            const rhsBlade = extract_single_blade(rhs);
            const residue = remove_factors(rhs, is_blade);
            const newExpr = multiply(env, residue, lhs.wedge(rhsBlade));
            try {
                return wrap_as_transform(newExpr, oldExpr);
            } finally {
                newExpr.release();
            }
        } else {
            const newExpr = multiply(env, lhs, rhs);
            try {
                return wrap_as_transform(newExpr, oldExpr);
            } finally {
                newExpr.release();
            }
        }
    }
}

export const outer_2_blade_mul = mkbuilder<EXP>(Op);
