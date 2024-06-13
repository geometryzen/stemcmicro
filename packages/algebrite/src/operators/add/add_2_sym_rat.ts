import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

/**
 * Sym + Rat => Rat + Sym
 */
class Op extends Function2<Sym, Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_sym_rat", MATH_ADD, is_sym, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Rat, exp: Cons, $: ExtensionEnv): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        } else {
            return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, rhs, lhs))];
        }
    }
}

export const add_2_sym_rat = mkbuilder(Op);
