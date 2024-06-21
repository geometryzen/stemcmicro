import { Rat } from "@stemcmicro/atoms";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "@stemcmicro/hashing";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { MATH_GT } from "../../runtime/ns_math";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

type LHS = Sym;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("testgt_sym_rat", MATH_GT, is_sym, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_GT, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (rhs.isNegative()) {
            return [TFLAG_DIFF, booT];
        }
        if (rhs.isZero()) {
            return [TFLAG_DIFF, booT];
        }
        return [TFLAG_DIFF, booF];
    }
}

export const testgt_sym_rat = mkbuilder<EXP>(Op);
