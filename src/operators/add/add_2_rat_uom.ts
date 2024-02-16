import { is_rat, is_uom, Rat, Sym, Uom } from "math-expression-atoms";
import { Cons2, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Rat;
type RHS = Uom;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super('add_2_rat_uom', MATH_ADD, is_rat, is_uom);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_RAT, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        throw new TypeError($.toInfixString(expr));
    }
}

export const add_2_rat_uom = mkbuilder(Op);
