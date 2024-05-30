import { Blade, is_blade } from "math-expression-atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";

type LHS = Sym;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): boolean {
    return $.isscalar(lhs);
}

/**
 * Sym * Blade => Sym * Blade (STABLE)
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Blade"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_sym_blade", MATH_MUL, is_sym, is_blade, cross);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_SYM, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        // TODO: Since expr is not evaluated, shouldn't we evaluate the lhs?
        return expr;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // TODO: Be aware that this may prevent the processing of Sym * Blade more generally.
        return [TFLAG_HALT, orig];
    }
}

export const mul_2_sym_blade = mkbuilder<EXP>(Op);
