import { Sym } from "math-expression-atoms";
import { Cons2, items_to_cons, U } from "math-expression-tree";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { is_multiply } from "../../runtime/helpers";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_mul_2_scalar_any } from "../mul/is_mul_2_scalar_any";

type LHS = U;
type RHS = Cons2<Sym, U, U>;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * x ^ (a * y) => a * (x ^ y)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor() {
        super('outer_2_any_mul_2_scalar_any', MATH_OUTER, is_any, is_mul_2_scalar_any);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const lhs = expr.lhs;
            if (is_multiply(lhs)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: unknown, $: ExtensionEnv): [TFLAGS, U] {
        const x = lhs;
        const a = rhs.lhs;
        const y = rhs.rhs;
        const xy = $.valueOf(items_to_cons(opr, x, y));
        const retval = $.valueOf(items_to_cons(rhs.opr, a, xy));
        return [TFLAG_DIFF, retval];
    }
}

export const outer_2_any_mul_2_scalar_any = mkbuilder(Op);
