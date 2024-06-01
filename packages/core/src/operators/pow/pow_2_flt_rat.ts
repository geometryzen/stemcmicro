import { is_flt, is_rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { create_flt, Flt } from "../../tree/flt/Flt";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";

class Op extends Function2<Flt, Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_flt_rat", MATH_POW, is_flt, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_FLT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(Math.pow(lhs.d, rhs.toNumber()))];
    }
}

export const pow_2_flt_rat = mkbuilder(Op);
