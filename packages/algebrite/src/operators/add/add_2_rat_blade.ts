import { Blade, is_blade, Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

type LHS = Rat;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_rat_blade", MATH_ADD, is_rat, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, rhs];
        } else {
            // It's a multivector in canonical order.
            return [TFLAG_HALT, expr];
        }
    }
}

export const add_2_rat_blade = mkbuilder(Op);
