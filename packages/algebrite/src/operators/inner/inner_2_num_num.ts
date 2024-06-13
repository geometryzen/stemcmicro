import { is_num, Num, Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { multiply_num_num } from "../../calculators/mul/multiply_num_num";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_INNER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

/**
 * Num | Num => Num * Num
 */
class Op extends Function2<Num, Num> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_num_num", MATH_INNER, is_num, is_num);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Num, rhs: Num): [TFLAGS, U] {
        return [TFLAG_DIFF, multiply_num_num(lhs, rhs)];
    }
}

export const inner_2_num_num = mkbuilder(Op);
