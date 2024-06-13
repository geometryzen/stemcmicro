import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function2 } from "../helpers/Function2";

class Op extends Function2<Flt, Flt> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_flt_flt", MATH_MUL, is_flt, is_flt);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Flt): [TFLAGS, U] {
        return [TFLAG_DIFF, lhs.mul(rhs)];
    }
}

export const mul_2_flt_flt = mkbuilder(Op);
