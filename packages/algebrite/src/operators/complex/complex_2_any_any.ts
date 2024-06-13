import { imu, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

const COMPLEX = native_sym(Native.complex);

/**
 * complex(x, y) => x + i * y
 */
class Op extends Function2<U, U> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("complex_2_any_any", COMPLEX, is_any, is_any);
        this.#hash = hash_binop_atom_atom(COMPLEX, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, x: U, y: U, exp: Cons2<Sym, U, U>, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.add(x, $.multiply(imu, y))];
    }
}

export const complex_2_any_any = mkbuilder(Op);
