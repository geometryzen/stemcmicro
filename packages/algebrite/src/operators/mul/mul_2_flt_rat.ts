import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { create_flt, Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

class Op extends Function2<Flt, Rat> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_flt_rat", MATH_MUL, is_flt, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        return [TFLAG_DIFF, create_flt(lhs.toNumber() * rhs.toNumber())];
    }
}

export const mul_2_flt_rat = mkbuilder(Op);
