import { is_rat, is_uom, Uom } from "@stemcmicro/atoms";
import { Cons2 } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, hash_for_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

type LHS = Uom;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_uom_rat", MATH_ADD, is_uom, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_UOM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        throw new TypeError($.toInfixString(expr));
    }
}

export const add_2_uom_rat = mkbuilder(Op);
