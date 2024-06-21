import { is_rat, is_sym, Rat, Sym } from "@stemcmicro/atoms";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "@stemcmicro/hashing";
import { Cons2 } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder } from "../../env/ExtensionEnv";
import { MATH_LT } from "../../runtime/ns_math";
import { Predicate2 } from "../helpers/Predicate2";

type LHS = Sym;
type RHS = Rat;
type EXPR = Cons2<Sym, LHS, RHS>;

class Op extends Predicate2<LHS, RHS> {
    readonly #hash: string;
    constructor(config: Readonly<EnvConfig>) {
        super("testlt_sym_rat", MATH_LT, is_sym, is_rat, config);
        this.#hash = hash_binop_atom_atom(MATH_LT, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    compute(lhs: LHS, rhs: RHS): boolean {
        if (rhs.isNegative()) {
            return false;
        }
        if (rhs.isZero()) {
            return false;
        }
        return false;
    }
}

export const testlt_sym_rat = mkbuilder<EXPR>(Op);
