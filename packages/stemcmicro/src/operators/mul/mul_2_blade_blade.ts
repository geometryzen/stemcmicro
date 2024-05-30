import { Blade, is_blade, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_BLADE } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";

type LHS = Blade;
type RHS = Blade;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Blade * Blade
 */
class Op extends Function2<Blade, Blade> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_blade_blade", native_sym(Native.multiply), is_blade, is_blade);
        this.#hash = hash_binop_atom_atom(native_sym(Native.multiply), HASH_BLADE, HASH_BLADE);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Blade, rhs: Blade, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(lhs.mul(rhs))];
    }
}

export const mul_2_blade_blade = mkbuilder<EXP>(Op);
