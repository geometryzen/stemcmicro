import { Rat } from "@stemcmicro/atoms";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "@stemcmicro/hashing";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { booF, booT } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

const testeq = native_sym(Native.testeq);

type LHS = Sym;
type RHS = Rat;
type EXPR = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("testeq_sym_rat", testeq, is_sym, is_rat);
        this.#hash = hash_binop_atom_atom(testeq, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, sym: LHS, rat: RHS, expr: EXPR, $: ExtensionEnv): [TFLAGS, U] {
        if (rat.isZero()) {
            const predicates = $.getSymbolPredicates(sym);
            if (predicates.zero) {
                return [TFLAG_DIFF, booT];
            }
        }
        return [TFLAG_DIFF, booF];
    }
}

export const testeq_sym_rat = mkbuilder<EXPR>(Op);
