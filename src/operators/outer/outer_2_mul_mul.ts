import { is_blade, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons0, Cons2, U } from "math-expression-tree";
import { contains_single_blade } from "../../calculators/compare/contains_single_blade";
import { extract_single_blade } from "../../calculators/compare/extract_single_blade";
import { remove_factors } from "../../calculators/remove_factors";
import { mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, hash_nonop_cons } from "../../hashing/hash_info";
import { multiply } from "../../helpers/multiply";
import { is_multiply } from "../../runtime/helpers";
import { MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { wrap_as_transform } from "../wrap_as_transform";

type LHS = Cons0<Sym>;
type RHS = Cons0<Sym>;
type EXP = Cons2<Sym, LHS, RHS>;

const HASH = hash_binop_atom_atom(MATH_OUTER, hash_nonop_cons(MATH_MUL), hash_nonop_cons(MATH_MUL));

/**
 * (* ...) ^ (* ...)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor() {
        super(HASH, MATH_OUTER, is_multiply, is_multiply);
        this.#hash = HASH;
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, oldExpr: EXP, env: ExprContext): [TFLAGS, U] {
        if (contains_single_blade(lhs) && contains_single_blade(rhs)) {
            const lhsBlade = extract_single_blade(lhs);
            const residueL = remove_factors(lhs, is_blade);
            const rhsBlade = extract_single_blade(rhs);
            const residueR = remove_factors(rhs, is_blade);
            const newExpr = multiply(env, residueL, residueR, lhsBlade.wedge(rhsBlade));
            try {
                return wrap_as_transform(newExpr, oldExpr);
            }
            finally {
                newExpr.release();
            }
        }
        else {
            // If there is only a blade on one side, or no blades on either side, treat as multiplication.
            const newExpr = multiply(env, lhs, rhs);
            try {
                return wrap_as_transform(newExpr, oldExpr);
            }
            finally {
                newExpr.release();
            }
        }
    }
}

export const outer_2_mul_mul = mkbuilder<EXP>(Op);
