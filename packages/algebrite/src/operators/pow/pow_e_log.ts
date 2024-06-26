import { is_sym, Sym } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { is_base_of_natural_logarithm } from "@stemcmicro/helpers";
import { Cons, is_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_SYM } from "@stemcmicro/hashing";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";

const LOG = native_sym(Native.log);
const POW = native_sym(Native.pow);

function cross(base: Sym, expo: U): boolean {
    if (is_base_of_natural_logarithm(base)) {
        if (is_cons(expo)) {
            const opr = expo.head;
            return is_sym(opr) && opr.equalsSym(LOG);
        } else {
            return false;
        }
    } else {
        return false;
    }
}

type LHS = Sym;
type RHS = Cons;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * exp(log(x)) => x
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_e_log", POW, is_sym, is_cons, cross);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_SYM, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP): [TFLAGS, U] {
        const x = expo.argList.head;
        return [TFLAG_DIFF, x];
    }
}

export const pow_e_log = mkbuilder(Op);
