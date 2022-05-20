import { CHANGED, ExtensionEnv, NOFLAGS, SIGN_EQ, SIGN_GT, TFLAGS } from "../../env/ExtensionEnv";
import { MATH_MUL } from "../../runtime/ns_math";
import { Cons, makeList, U } from "../../tree/tree";
import { compare_factors } from "../compare/compare_factors";

/**
 * TODO: Doing this for accuracy, but it is slow.
 */
function compute_changed(newExpr: U, oldExpr: U): TFLAGS {
    if (newExpr.equals(oldExpr)) {
        return NOFLAGS;
    }
    return CHANGED;
}

export function canonical_order_factors_3(s1: U, s2: U, s3: U, oldExpr: Cons, $: ExtensionEnv): [TFLAGS, U] {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string) {
        // console.lg(`s1=${s1}, s2=${s2}, s3=${s3}, retval: ${print_expr(retval, $)} @ ${description}`);
        return retval;
    };
    // Cycling through here comparing s1,s2 then s2,s3, then s3, s1
    switch (compare_factors(s1, s2, $)) {
        case SIGN_GT: {
            switch (compare_factors(s2, s3, $)) {
                case SIGN_GT: {
                    const s3s2 = makeList(MATH_MUL, s3, s2);
                    const newExpr = makeList(MATH_MUL, s3s2, s1);
                    return [compute_changed(newExpr, oldExpr), hook(newExpr, "A")];
                }
                default: {
                    switch (compare_factors(s3, s1, $)) {
                        case SIGN_GT: {
                            const s2s1 = makeList(MATH_MUL, s2, s1);
                            const newExpr = makeList(MATH_MUL, s2s1, s3);
                            return [compute_changed(newExpr, oldExpr), hook(newExpr, "B")];
                        }
                        default: {
                            const s2s3 = makeList(MATH_MUL, s2, s3);
                            const newExpr = makeList(MATH_MUL, s2s3, s1);
                            return [compute_changed(newExpr, oldExpr), hook(newExpr, "C")];
                        }
                    }
                }
            }
        }
        default: {
            switch (compare_factors(s2, s3, $)) {
                case SIGN_GT: {
                    switch (compare_factors(s3, s1, $)) {
                        case SIGN_GT: {
                            const s1s3 = makeList(MATH_MUL, s1, s3);
                            const newExpr = makeList(MATH_MUL, s1s3, s2);
                            return [compute_changed(newExpr, oldExpr), hook(newExpr, "D")];
                        }
                        case SIGN_EQ: {
                            // This says don't change the order of 3 and 1
                            // 1,2,3 but 2 is after 3 so 1,3,2 is the order.
                            const s1s3 = makeList(MATH_MUL, s1, s3);
                            const newExpr = makeList(MATH_MUL, s1s3, s2);
                            return [compute_changed(newExpr, oldExpr), hook(newExpr, "E")];
                        }
                        default: {
                            const s3s1 = makeList(MATH_MUL, s3, s1);
                            const newExpr = makeList(MATH_MUL, s3s1, s2);
                            return [compute_changed(newExpr, oldExpr), hook(newExpr, "F")];
                        }
                    }
                }
                default: {
                    if ($.isAssocL(MATH_MUL)) {
                        return [NOFLAGS, hook(oldExpr, "G")];
                    }
                    if ($.isAssocR(MATH_MUL)) {
                        const s2s3 = makeList(MATH_MUL, s2, s3);
                        const newExpr = makeList(MATH_MUL, s1, s2s3);
                        return [compute_changed(newExpr, oldExpr), hook(newExpr, "H")];
                    }
                    return [NOFLAGS, hook(oldExpr, "I")];
                }
            }
        }
    }
}
