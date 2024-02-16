import { compare_U_U } from "../../calculators/compare/compare_U_U";
import { Extension, ExtensionBuilder, ExtensionEnv, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_cons_cons } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { and } from "./and";
import { Cons1 } from "./Cons1";
import { Cons2 } from "./Cons2";
import { Function2 } from "./Function2";
import { is_opr_1_any } from "./is_opr_1_any";

/**
 * The ordering is based upon the names of the functions and then upon their arguments.
 * But this should be possible with a standard comparitor.
 * DEAD CODE?
 * Code does not work as advertized anyway.
 */
export class Opr2Lhs1Rhs1SwitchBuilder implements ExtensionBuilder<Cons> {
    constructor(public readonly opr: Sym, public readonly lhs: Sym, public readonly rhs: Sym) {
        // Nothing to see here.
    }
    create(): Extension<Cons> {
        return new Op(this.opr, this.lhs, this.rhs);
    }
}

type LHS = Cons1<Sym, U>;
type RHS = Cons1<Sym, U>;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (opr (lhs) (rhs)) => (opr (rhs) (lhs))
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(opr: Sym, lhs: Sym, rhs: Sym) {
        super(`${opr.key()}_2_${lhs.key()}_1_any_${rhs.key()}_1_any`, opr, and(is_cons, is_opr_1_any(lhs)), and(is_cons, is_opr_1_any(rhs)));
        this.#hash = hash_binop_cons_cons(opr, lhs, rhs);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const argL = lhs.arg;
        const argR = rhs.arg;
        switch (compare_U_U(argL, argR)) {
            case SIGN_GT: {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, orig.rhs, orig.lhs))];
            }
        }
        return [TFLAG_HALT, orig];
    }
}
