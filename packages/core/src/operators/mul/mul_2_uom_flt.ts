import { Uom } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, hash_for_atom } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { zero } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_uom } from "../uom/is_uom";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

type LHS = Uom;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (* Uom Flt) => (* Flt Uom)
 *             => 0 if Flt is zero
 *             => Uom if Flt is one
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_uom_flt", MATH_MUL, is_uom, is_flt);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_UOM, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export const mul_2_uom_flt = mkbuilder<EXP>(Op);
