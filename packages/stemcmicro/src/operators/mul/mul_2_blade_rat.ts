import { Blade, is_blade } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

type LHS = Blade;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Blade * Rat => Rat * Blade
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Blade"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_blade_rat", MATH_MUL, is_blade, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_BLADE, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
    }
}

export const mul_2_blade_rat = mkbuilder<EXP>(Op);
