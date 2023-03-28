import { Extension, ExtensionEnv, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_HYP } from "../../hashing/hash_info";
import { epsilon, Hyp } from "../../tree/hyp/Hyp";
import { cons, Cons, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

class HypExtension implements Extension<Hyp> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key() {
        return epsilon.name;
    }
    get hash() {
        return HASH_HYP;
    }
    get name() {
        return 'HypExtension';
    }
    evaluate(hyp: Hyp, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(hyp, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Hyp ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(hyp: Hyp, $: ExtensionEnv): U {
        throw new Error("Hyp Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(hyp: Hyp): boolean {
        return false;
    }
    isKind(arg: U): arg is Hyp {
        return arg instanceof Hyp;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Hyp): boolean {
        return true;
    }
    isZero(): boolean {
        // A hyperreal is non-zero and small than every real number.
        return false;
    }
    subst(expr: Hyp, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(hyp: Hyp, $: ExtensionEnv): string {
        return hyp.printname;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(hyp: Hyp, $: ExtensionEnv): string {
        return hyp.printname;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(hyp: Hyp, $: ExtensionEnv): string {
        return hyp.printname;
    }
}

/**
 * The hyperreal Extension.
 */
export const hyp_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new HypExtension($);
});