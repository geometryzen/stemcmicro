import { is_rat, is_uom, QQ, Rat, Sym, Uom } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, hash_for_atom, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_POW } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

class Op extends Function2<Uom, Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_uom_rat", MATH_POW, is_uom, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_UOM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Uom, rhs: Rat): [TFLAGS, U] {
        const expo = QQ.valueOf(rhs.numer().toNumber(), rhs.denom().toNumber());
        return [TFLAG_DIFF, lhs.pow(expo)];
    }
}

export const pow_2_uom_rat = mkbuilder(Op);
