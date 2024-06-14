import { Blade } from "@stemcmicro/atoms";
import { Sign, SIGN_EQ, SIGN_GT, SIGN_LT } from "@stemcmicro/context";

/**
 * Compares blades according to the canonical representation.
 * This may not be the ordering that is desired for pretty printing.
 */
export function compare_blade_blade(lhs: Blade, rhs: Blade): Sign {
    // This ordering produces the canonical ordering in the Bitmap Representation.
    // See GEOMETRIC ALGEBRA for Computer Science, p 512.
    // e.g.
    // 1, e1, e2, e1 ^ e2, e3, e1 ^ e3, e2 ^ e3, e1 ^ e2 ^ e3.
    // Indexing the Bitmap 1-based from the RHS, the ith bit indicates whether ei is present.
    // The Basis Blade is then the outer product of all blades present in order of increasing index.
    // e.g.
    // 101 is e1 ^ e3, 110 is e2 ^ e3, 111 is e1 ^ e2 ^ e3, 0 is 1 but we don't have the scalar blade in this implementation
    // because we keep the scaling out of the Vec.
    const x = lhs.bitmap;
    const y = rhs.bitmap;
    if (x < y) {
        return SIGN_LT;
    }
    if (x > y) {
        return SIGN_GT;
    }
    return SIGN_EQ;
}
