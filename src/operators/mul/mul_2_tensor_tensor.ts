
import { is_tensor, Sym, Tensor } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons2, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_TENSOR } from "../../hashing/hash_info";
import { Function2X } from "../helpers/Function2X";
import { inner_tensor_tensor } from "../inner/inner_tensor_tensor";

type LHS = Tensor;
type RHS = Tensor;
type EXP = Cons2<Sym, LHS, RHS>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function cross() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return function (lhs: LHS, rhs: RHS): boolean {
        return true;
    };
}

/**
 *
 */
class Op extends Function2X<LHS, RHS> implements Extension<EXP> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_tensor_tensor', native_sym(Native.multiply), is_tensor, is_tensor, cross());
        this.#hash = hash_binop_atom_atom(native_sym(Native.multiply), HASH_TENSOR, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, inner_tensor_tensor(lhs, rhs, $)];
    }
}

export const mul_2_tensor_tensor = mkbuilder<EXP>(Op);
