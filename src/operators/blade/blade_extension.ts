import { Blade, is_blade, Sym } from "math-expression-atoms";
import { Extension, ExtensionEnv, FEATURE, Sign, SIGN_EQ, SIGN_GT, SIGN_LT, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_BLADE } from "../../hashing/hash_info";
import { cons, Cons, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

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

class BladeExtension implements Extension<Blade> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    iscons(): boolean {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        // TODO: How do we create an exemplar from which to compute the hash?
        return HASH_BLADE;
    }
    get name(): string {
        return 'BladeExtension';
    }
    get dependencies(): FEATURE[] {
        return ['Blade'];
    }
    isKind(arg: unknown): arg is Blade {
        return is_blade(arg);
    }
    subst(expr: Blade, oldExpr: U, newExpr: U): U {
        if (is_blade(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(vec: Blade): string {
        return vec.toInfixString();
    }
    toLatexString(vec: Blade): string {
        return vec.toLatexString();
    }
    toListString(vec: Blade): string {
        return vec.toListString();
    }
    evaluate(expr: Blade, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_blade(expr)) {
            return [TFLAG_HALT, expr];
        }
        return [TFLAG_NONE, expr];
    }
    valueOf(expr: Blade): U {
        return expr;
    }
}

export const blade_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new BladeExtension($);
});