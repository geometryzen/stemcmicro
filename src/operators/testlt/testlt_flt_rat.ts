import { Flt, is_flt, is_rat, Rat, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons2 } from "math-expression-tree";
import { compare_num_num } from "../../calculators/compare/compare_num_num";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, mkbuilder } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { Predicate2 } from "../helpers/Predicate2";

export const MATH_LT = native_sym(Native.testlt);

type LHS = Flt;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Predicate2<LHS, RHS> implements Extension<EXP> {
    readonly #hash: string;
    constructor(config: Readonly<EnvConfig>) {
        super('testlt_flt_rat', MATH_LT, is_flt, is_rat, config);
        this.#hash = hash_binop_atom_atom(MATH_LT, HASH_FLT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(lhs: LHS, rhs: RHS): boolean {
        return compare_num_num(lhs, rhs) < 0;
    }
}

export const testlt_flt_rat = mkbuilder<EXP>(Op);
