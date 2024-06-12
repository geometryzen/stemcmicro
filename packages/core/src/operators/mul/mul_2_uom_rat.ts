import { Rat, Uom, zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, hash_for_atom, HASH_RAT } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_uom } from "../uom/is_uom";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

type LHS = Uom;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (* Uom Rat) => (* Rat Uom)
 *             => 0 if Rat is zero
 *             => Uom if Rat is one
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_uom_rat", MATH_MUL, is_uom, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_UOM, HASH_RAT);
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

export const mul_2_uom_rat = mkbuilder<EXP>(Op);
