
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

/**
 * Rat + Rat => Rat
 */
class Op extends Function2<Rat, Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('add_2_rat_rat', MATH_ADD, is_rat, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.add(rhs)];
    }
}

export const add_2_rat_rat = mkbuilder(Op);
