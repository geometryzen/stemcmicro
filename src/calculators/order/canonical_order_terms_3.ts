import { ExtensionEnv, TFLAG_NONE, SIGN_GT, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { is_add_2_any_any } from "../../operators/add/is_add_2_any_any";
import { MATH_ADD } from "../../runtime/ns_math";
import { Cons, is_cons, items_to_cons, U } from "../../tree/tree";
import { compare_terms_redux } from "../compare/compare_terms";

/**
 * (X+Y)+Z transformation for canonical ordering.
 * 
 * Because operator '+' is left-associative, we assert that Y and Z are not additions.
 * 
 * There are two cases to consider according to whether X is an add expression or not.
 * When X is not an add expression, it may be freely exchanged with Y or Z according to term comparison ordering.
 * When X is an add expression it may not be exchanged. There is also no need to consider its content because this
 * will have been handled by the prior case. So when X is an add expression, the only freedom is to order Y and Z.
 */
export function canonical_order_terms_3(t1: U, t2: U, t3: U, orig: Cons, $: ExtensionEnv): [TFLAGS, U] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string) {
        // console.lg(`${$.toListString(t1)} ${$.toListString(t2)} ${$.toListString(t3)} => ${$.toListString(retval)} canonical_order_terms_3 @ ${description} orig = ${$.toListString(orig)}`);
        return retval;
    };
    // console.log(`${$.toListString(X)} ${$.toListString(Y)} ${$.toListString(Z)} orig = ${$.toListString(orig)}`);
    // assert_not_add(Y);
    // assert_not_add(Z);
    if (is_cons(t1) && is_add_2_any_any(t1)) {
        return branch(t1, t2, t3, orig, $);
    }
    else {
        // Cycling through here comparing pairs (s1,s2) then (s2,s3), then (s3,s1).
        switch (compare_terms_redux(t1, t2, $)) {
            case SIGN_GT: {
                // t2, t1
                switch (compare_terms_redux(t2, t3, $)) {
                    case SIGN_GT: {
                        // t3, t1, t1
                        const t3t2 = items_to_cons(MATH_ADD, t3, t2);
                        return [TFLAG_DIFF, hook(items_to_cons(MATH_ADD, t3t2, t1), "A")];
                    }
                    default: {
                        // t2, (t1,t3)
                        switch (compare_terms_redux(t3, t1, $)) {
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
                switch (compare_terms_redux(t2, t3, $)) {
                    case SIGN_GT: {
                        // (t1,t3), t2
                        switch (compare_terms_redux(t3, t1, $)) {
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

function branch(X: Cons, Y: U, Z: U, orig: U, $: ExtensionEnv): [TFLAGS, U] {
    switch (compare_terms_redux(Y, Z, $)) {
        case SIGN_GT: {
            const addXZ = items_to_cons(MATH_ADD, X, Z);
            return [TFLAG_DIFF, items_to_cons(MATH_ADD, addXZ, Y)];
        }
        default: {
            // t1, t2, t3
            return [TFLAG_NONE, orig];
        }
    }
}
