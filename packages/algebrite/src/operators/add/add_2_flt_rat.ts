import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_ADD } from "../../runtime/ns_math";
import { create_flt, Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

class Op extends Function2<Flt, Rat> implements Extension<Cons> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Rat"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_flt_rat", MATH_ADD, is_flt, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_FLT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Rat): [TFLAGS, U] {
        const lhsNum = lhs.toNumber();
        const rhsNum = rhs.toNumber();
        return [TFLAG_DIFF, create_flt(lhsNum + rhsNum)];
    }
}

export const add_2_flt_rat = mkbuilder(Op);
