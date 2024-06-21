import { Flt, is_flt, is_uom, Sym, Uom } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, hash_for_atom } from "@stemcmicro/hashing";
import { MATH_ADD } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { create_uom } from "../uom/uom";

const HASH_UOM = hash_for_atom(create_uom("kilogram"));

type LHS = Flt;
type RHS = Uom;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_flt_uom", MATH_ADD, is_flt, is_uom);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_FLT, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Flt, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        throw new TypeError($.toInfixString(expr));
    }
}

export const add_2_flt_uom = mkbuilder(Op);
