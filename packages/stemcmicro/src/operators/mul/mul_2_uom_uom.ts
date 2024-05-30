import { create_int, is_uom, Sym, Uom } from "math-expression-atoms";
import { U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_UOM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

/**
 * Uom * Uom
 */
class Op extends Function2<Uom, Uom> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = ["Uom"];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_uom_uom", MATH_MUL, is_uom, is_uom);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_UOM, HASH_UOM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Uom, rhs: Uom): [TFLAGS, U] {
        const uom = lhs.mul(rhs);
        if (uom.isOne()) {
            return [TFLAG_DIFF, create_int(1)];
        } else {
            return [TFLAG_DIFF, uom];
        }
    }
}

export const mul_2_uom_uom = mkbuilder(Op);
