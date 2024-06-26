import { Blade, is_blade, is_rat, Rat } from "@stemcmicro/atoms";
import { items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Function2 } from "../helpers/Function2";

class Op extends Function2<Blade, Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_blade_rat", MATH_POW, is_blade, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_BLADE, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Rat): [TFLAGS, U] {
        if (rhs.isTwo()) {
            return [TFLAG_DIFF, lhs.mul(lhs)];
        } else {
            return [TFLAG_NONE, items_to_cons(opr, lhs, rhs)];
        }
    }
}

export const pow_2_blade_rat = mkbuilder(Op);
