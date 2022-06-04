import { SIGN_GT } from "../../env/ExtensionEnv";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { compare_sym_sym } from "../compare/compare_sym_sym";

/**
 * An implementation of canonical_reorder_terms that is optimized for Sym Sym Sym.
 * TODO: Not clear whether maintaining this specialization will be justified.
 * More specialization means more testing.
 * @param s1 
 * @param s2 
 * @param s3 
 * @param orig 
 * @returns 
 */
export function canonical_order_terms_sym_sym_sym(s1: Sym, s2: Sym, s3: Sym, orig: Cons): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string) {
        // console.lg(`retval: ${retval} @ ${description}`);
        return retval;
    };
    // Cycling through here comparing s1,s2 then s2,s3, then s3, s1
    switch (compare_sym_sym(s1, s2)) {
        case SIGN_GT: {
            // s2 < s1
            switch (compare_sym_sym(s2, s3)) {
                case SIGN_GT: {
                    const add32 = items_to_cons(MATH_ADD, s3, s2);
                    return hook(items_to_cons(MATH_ADD, add32, s1), "A");
                }
                default: {
                    switch (compare_sym_sym(s3, s1)) {
                        case SIGN_GT: {
                            const add21 = items_to_cons(MATH_ADD, s2, s1);
                            return hook(items_to_cons(MATH_ADD, add21, s3), "B");
                        }
                        default: {
                            const add23 = items_to_cons(MATH_ADD, s2, s3);
                            return hook(items_to_cons(MATH_ADD, add23, s1), "C");
                        }
                    }
                }
            }
        }
        default: {
            switch (compare_sym_sym(s2, s3)) {
                case SIGN_GT: {
                    switch (compare_sym_sym(s3, s1)) {
                        case SIGN_GT: {
                            const add13 = items_to_cons(MATH_ADD, s1, s3);
                            return hook(items_to_cons(MATH_ADD, add13, s2), "D");
                        }
                        default: {
                            const add31 = items_to_cons(MATH_ADD, s3, s1);
                            return hook(items_to_cons(MATH_ADD, add31, s2), "E");
                        }
                    }
                }
                default: {
                    return hook(orig, "E");
                }
            }
        }
    }
}
