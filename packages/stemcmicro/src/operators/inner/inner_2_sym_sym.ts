import { is_sym, Sym } from "@stemcmicro/atoms";
import { Cons2, items_to_cons, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_INNER, MATH_MUL } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

type LHS = Sym;
type RHS = Sym;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * Sym | Sym => Sym * Sym
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("inner_2_sym_sym", MATH_INNER, is_sym, is_sym);
        this.#hash = hash_binop_atom_atom(MATH_INNER, HASH_SYM, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(items_to_cons(MATH_MUL.clone(opr.pos, opr.end), lhs, rhs))];
    }
}

export const inner_2_sym_sym = mkbuilder<EXP>(Op);
