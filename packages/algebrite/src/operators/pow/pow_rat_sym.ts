import { one, Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

const POW = native_sym(Native.pow);

type LHS = Rat;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_rat_sym", POW, is_rat, is_sym);
        this.#hash = hash_binop_atom_atom(POW, HASH_RAT, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if (base.isOne()) {
            if ($.isreal(expo)) {
                return [TFLAG_DIFF, one];
            } else {
                return [TFLAG_HALT, expr];
            }
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const pow_rat_sym = mkbuilder<EXP>(Op);
