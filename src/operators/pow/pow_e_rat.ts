import { is_rat, is_sym } from "math-expression-atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { MATH_POW } from "../../runtime/ns_math";
import { one, Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross(lhs: Sym, rhs: U): boolean {
    return is_base_of_natural_logarithm(lhs) && is_rat(rhs);
}
/*
function is_pi_times_imu(expr: Cons) {
    if (is_mul_2_any_any(expr)) {
        const lhs = expr.lhs;
        const rhs = expr.rhs;
        return MATH_PI.equals(lhs) && is_imu(rhs);
    }
    else {
        return false;
    }
}
*/

type LHS = Sym;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (pow e X) is equivalent to exp(X)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('pow_e_rat', MATH_POW, is_sym, is_rat, cross);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_SYM, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, base: Sym, expo: Rat, expr: EXP): [TFLAGS, U] {
        if (expo.isZero()) {
            return [TFLAG_NONE, one];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_e_rat = mkbuilder<EXP>(Op);

