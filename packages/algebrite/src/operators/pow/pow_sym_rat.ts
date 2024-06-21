import { one, Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "@stemcmicro/hashing";
import { MATH_POW } from "../../runtime/ns_math";
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
        super("pow_2_sym_rat", MATH_POW, is_sym, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        // No change in arguments
        if (expo.isOne()) {
            return [TFLAG_DIFF, base];
        } else if (expo.isZero()) {
            // TODO: Some debate here about how (pow 0 0) should be handled.
            return [TFLAG_DIFF, one];
        } else {
            return [TFLAG_HALT, expr];
        }
    }
}

export const pow_2_sym_rat = mkbuilder<EXP>(Op);
