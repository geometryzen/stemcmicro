import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

class Op extends Function2<Flt, Flt> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_flt_flt", MATH_ADD, is_flt, is_flt);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_FLT, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Flt, orig: Cons2<Sym, Flt, Flt>): [TFLAGS, U] {
        return [TFLAG_DIFF, orig.lhs.add(orig.rhs)];
    }
}

export const add_2_flt_flt = mkbuilder(Op);
