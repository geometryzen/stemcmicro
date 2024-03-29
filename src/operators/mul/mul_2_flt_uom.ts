
import { Flt, is_flt, is_uom, Sym, Uom } from "math-expression-atoms";
import { Cons2, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_FLT, HASH_UOM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

/**
 * Flt * Uom
 */
class Op extends Function2<Flt, Uom> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ['Flt', 'Uom'];
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_flt_uom', MATH_MUL, is_flt, is_uom);
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
