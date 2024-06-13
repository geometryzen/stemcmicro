import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM, HASH_TENSOR } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_sym } from "../sym/is_sym";
import { is_tensor } from "../tensor/is_tensor";

type LHS = Tensor;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): boolean {
    return $.isscalar(rhs);
}

/**
 *
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_tensor_sym", MATH_MUL, is_tensor, is_sym, cross);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_TENSOR, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = lhs.map(function (value: U) {
            return $.multiply(value, rhs);
        });
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_tensor_sym = mkbuilder<EXP>(Op);
