import { TFLAG_DIFF, ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_sym } from "../sym/is_sym";
import { is_add_2_sym_sym } from "./is_add_2_sym_sym";

type LHS = BCons<Sym, Sym, Sym>;
type RHS = Sym;
type EXPR = BCons<Sym, LHS, RHS>;

function canoncal_reorder_terms_add_sym_sym_sym(lhs: LHS, rhs: RHS, orig: EXPR, $: ExtensionEnv): [TFLAGS, U] {
    const s1 = lhs.lhs;
    const s2 = lhs.rhs;
    const s3 = rhs;
    return canonical_order_terms_3(s1, s2, s3, orig, $);
}

export function canonical_order_terms_3(t1: Sym, t2: Sym, t3: Sym, orig: EXPR, $: ExtensionEnv): [TFLAGS, U] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string) {
        // console.lg(`${$.toListString(t1)} ${$.toListString(t2)} ${$.toListString(t3)} => ${$.toListString(retval)} canonical_order_terms_3 @ ${description} orig = ${$.toListString(orig)}`);
        return retval;
    };
    {
        // Cycling through here comparing pairs (s1,s2) then (s2,s3), then (s3,s1).
        switch (t1.compare(t2)) {
            // TODO: This case may be dead code because add_2_sym_sym will have already ordered t1 and t2.
            case SIGN_GT: {
                // t2, t1
                switch (t2.compare(t3)) {
                    case SIGN_GT: {
                        // t3, t1, t1
                        const t3t2 = items_to_cons(MATH_ADD, t3, t2);
                        return [TFLAG_DIFF, hook(items_to_cons(MATH_ADD, t3t2, t1), "A")];
                    }
                    default: {
                        // t2, (t1,t3)
                        switch (t3.compare(t1)) {
                            case SIGN_GT: {
                                // t2, t1, t3
                                const t2t1 = items_to_cons(MATH_ADD, t2, t1);
                                return [TFLAG_DIFF, hook(items_to_cons(MATH_ADD, t2t1, t3), "B")];
                            }
                            default: {
                                // t2, t3, t1
                                const t2t3 = items_to_cons(MATH_ADD, t2, t3);
                                return [TFLAG_DIFF, hook($.valueOf(items_to_cons(MATH_ADD, t2t3, t1)), "C")];
                            }
                        }
                    }
                }
            }
            default: {
                // t1, t2
                switch (t2.compare(t3)) {
                    case SIGN_GT: {
                        // (t1,t3), t2
                        switch (t3.compare(t1)) {
                            case SIGN_GT: {
                                const t1t3 = items_to_cons(MATH_ADD, t1, t3);
                                return [TFLAG_DIFF, hook(items_to_cons(MATH_ADD, t1t3, t2), "D")];
                            }
                            default: {
                                const t3t1 = items_to_cons(MATH_ADD, t3, t1);
                                return [TFLAG_DIFF, hook(items_to_cons(MATH_ADD, t3t1, t2), "E")];
                            }
                        }
                    }
                    default: {
                        // t1, t2, t3
                        if ($.isAssocL(MATH_ADD)) {
                            return [TFLAG_NONE, hook(orig, "F")];
                        }
                        if ($.isAssocR(MATH_ADD)) {
                            const t2t3 = items_to_cons(MATH_ADD, t2, t3);
                            return [TFLAG_DIFF, hook(items_to_cons(MATH_ADD, t1, t2t3), "G")];
                        }
                        return [TFLAG_NONE, hook(orig, "H")];
                    }
                }
            }
        }
    }
}

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

/**
 * TODO: Split the roles of reordering and implicating.
 * (a + b) + c
 */
class Op extends Function2<LHS, RHS> implements Operator<EXPR> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('add_2_add_2_sym_sym_sym', MATH_ADD, and(is_cons, is_add_2_sym_sym), is_sym, $);
        this.hash = hash_binop_cons_atom(MATH_ADD, MATH_ADD, HASH_SYM);
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXPR): [TFLAGS, U] {
        const $ = this.$;
        if ($.explicateMode) {
            return canoncal_reorder_terms_add_sym_sym_sym(lhs, rhs, orig, $);
        }
        /*
        if ($.implicateMode) {
            return [CHANGED, makeList(opr, lhs.lhs, lhs.rhs, rhs)];
        }
        */
        return [TFLAG_NONE, orig];
    }
}

export const add_2_add_2_sym_sym_sym = new Builder();
