import { Blade, is_blade, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { contains_single_blade, extract_single_blade, multiply, remove_factors } from "@stemcmicro/helpers";
import { Cons0, Cons2, U } from "@stemcmicro/tree";
import { mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, hash_nonop_cons } from "@stemcmicro/hashing";
import { is_multiply } from "../../runtime/helpers";
import { MATH_MUL, MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { wrap_as_transform } from "../wrap_as_transform";

type LHS = Cons0<Sym>;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

const HASH = hash_binop_atom_atom(MATH_OUTER, hash_nonop_cons(MATH_MUL), HASH_BLADE);

/**
 * (* ...) ^ Blade
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor() {
        super(HASH, MATH_OUTER, is_multiply, is_blade);
        this.#hash = HASH;
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, oldExpr: EXP, env: ExprContext): [TFLAGS, U] {
        if (contains_single_blade(lhs)) {
            const lhsBlade = extract_single_blade(lhs);
            const residue = remove_factors(lhs, is_blade);
            const newExpr = multiply(env, residue, lhsBlade.wedge(rhs));
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

export const outer_2_mul_blade = mkbuilder<EXP>(Op);
