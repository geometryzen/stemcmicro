import { Blade, is_blade, Sym } from "@stemcmicro/atoms";
import { Cons2, U } from "@stemcmicro/tree";
import { FEATURE, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "@stemcmicro/hashing";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { wrap_as_transform } from "../wrap_as_transform";

type LHS = Blade;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Blade ^ Blade
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Blade"];
    constructor() {
        super("outer_2_blade_blade", MATH_OUTER, is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(MATH_OUTER, HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, oldExpr: EXP): [TFLAGS, U] {
        const newExpr = lhs.wedge(rhs);
        try {
            return wrap_as_transform(newExpr, oldExpr);
        } finally {
            newExpr.release();
        }
    }
}

export const outer_2_blade_blade = mkbuilder<EXP>(Op);
