
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_TENSOR } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { is_tensor } from "../tensor/is_tensor";

type LHS = Tensor;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>

/**
 *
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_tensor_any', MATH_MUL, is_tensor, is_any);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_TENSOR, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = lhs.map(function (value: U) {
            return $.multiply(value, rhs);
        });
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_tensor_any = mkbuilder<EXP>(Op);
