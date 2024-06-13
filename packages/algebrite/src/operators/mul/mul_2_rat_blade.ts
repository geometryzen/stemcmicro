import { Blade, is_blade, is_rat, Rat, Sym, zero } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

type LHS = Rat;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

function eval_mul_2_rat_blade(expr: EXP): U {
    const lhs = expr.lhs;
    const rhs = expr.rhs;
    try {
        return mul_2_rat_blade(lhs, rhs, expr);
    } finally {
        lhs.release();
        rhs.release();
    }
}

function mul_2_rat_blade(lhs: Rat, rhs: Blade, expr: EXP): Rat | Blade | EXP {
    if (lhs.isZero()) {
        return zero;
    }
    if (lhs.isOne()) {
        return rhs;
    }
    return expr;
}

/**
 * (* Rat Blade) => (* Rat Blade) STABLE
 *               => 0 if Rat is zero
 *               => Blade if Rat is one
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Blade"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_rat_blade", MATH_MUL, is_rat, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return eval_mul_2_rat_blade(expr);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        const retval = mul_2_rat_blade(lhs, rhs, expr);
        if (retval.equals(expr)) {
            return [TFLAG_HALT, retval];
        } else {
            return [TFLAG_DIFF, retval];
        }
    }
}

export const mul_2_rat_blade_builder = mkbuilder(Op);
