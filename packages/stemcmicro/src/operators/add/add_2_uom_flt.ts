import { is_uom, Uom } from "math-expression-atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";

type LHS = Uom;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Flt", "Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_uom_flt", MATH_ADD, is_uom, is_flt);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_UOM, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        throw new TypeError($.toInfixString(expr));
    }
}

export const add_2_uom_flt = mkbuilder(Op);
