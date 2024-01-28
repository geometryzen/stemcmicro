import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT, HASH_SYM } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF, booT } from "../../tree/boo/Boo";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";
import { is_sym } from "../sym/is_sym";

const testeq = native_sym(Native.testeq);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

type LHS = Sym;
type RHS = Rat;
type EXPR = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('testeq_sym_rat', testeq, is_sym, is_rat, $);
        this.#hash = hash_binop_atom_atom(testeq, HASH_SYM, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, sym: LHS, rat: RHS, expr: EXPR): [TFLAGS, U] {
        if (rat.isZero()) {
            const $ = this.$;
            const predicates = $.getSymbolPredicates(sym);
            if (predicates.zero) {
                return [TFLAG_DIFF, booT];
            }
        }
        return [TFLAG_DIFF, booF];
    }
}

export const testeq_sym_rat = new Builder();
