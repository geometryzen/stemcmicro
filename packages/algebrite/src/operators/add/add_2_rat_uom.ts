import { is_rat, is_uom, Rat, Sym, Uom } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, hash_for_atom, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_ADD } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

type LHS = Rat;
type RHS = Uom;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_rat_uom", MATH_ADD, is_rat, is_uom);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        throw new TypeError($.toInfixString(expr));
    }
}

export const add_2_rat_uom = mkbuilder<EXP>(Op);
