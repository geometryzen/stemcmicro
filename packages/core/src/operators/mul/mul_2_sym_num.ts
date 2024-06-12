import { zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Num } from "../../tree/num/Num";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_num } from "../num/is_num";
import { is_sym } from "../sym/is_sym";

/**
 * Sym * Num => Num * Sym
 */
class Op extends Function2<Sym, Num> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_sym_num", MATH_MUL, is_sym, is_num);
        this.#hash = `(* Sym Num)`;
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Sym, rhs: Num): [TFLAGS, U] {
        if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        }
        if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        }
        return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
    }
}

export const mul_2_sym_num = mkbuilder(Op);
