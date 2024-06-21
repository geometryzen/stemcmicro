import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_TENSOR } from "@stemcmicro/hashing";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_tensor } from "../tensor/is_tensor";
import { add_tensor_tensor } from "../tensor/tensor_extension";

type LHS = Tensor;
type RHS = Tensor;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Tensor + Tensor => Tensor
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_tensor_tensor", MATH_ADD, is_tensor, is_tensor);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_TENSOR, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, add_tensor_tensor(lhs, rhs, $)];
    }
}

export const add_2_tensor_tensor = mkbuilder(Op);
