import { Flt, is_flt, is_uom, Sym, Uom } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, hash_for_atom } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

/**
 * Flt * Uom
 */
class Op extends Function2<Flt, Uom> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_flt_uom", MATH_MUL, is_flt, is_uom);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: Uom, expr: Cons2<Sym, Flt, Uom>): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        }
        if (lhs.isOne()) {
            return [TFLAG_DIFF, rhs];
        }
        return [TFLAG_HALT, expr];
    }
}

export const mul_2_flt_uom = mkbuilder(Op);
