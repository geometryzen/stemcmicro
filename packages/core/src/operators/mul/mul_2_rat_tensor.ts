import { Rat, zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_TENSOR } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Tensor } from "../../tree/tensor/Tensor";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_tensor } from "../tensor/is_tensor";

type LHS = Rat;
type RHS = Tensor;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (* Rat Sym) => (* Rat Sym) STABLE
 *             => 0 if Rat is zero
 *             => Sym if Rat is one
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_rat_tensor", MATH_MUL, is_rat, is_tensor);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_TENSOR);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if (lhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (lhs.isOne()) {
            return [TFLAG_DIFF, rhs];
        }
        const retval = rhs.map(function (value: U) {
            return $.multiply(lhs, value);
        });
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_rat_tensor = mkbuilder<EXP>(Op);
