import { Extension, ExtensionEnv, FEATURE, Sign, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { number_to_floating_point_string } from "../../runtime/number_to_floating_point_string";
import { Flt, oneAsFlt } from "../../tree/flt/Flt";
import { cons, Cons, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

export function is_flt(p: unknown): p is Flt {
    return p instanceof Flt;
}

export function compare_flts(lhs: Flt, rhs: Flt): Sign {
    if (lhs.d < rhs.d) {
        return -1;
    }
    if (lhs.d > rhs.d) {
        return 1;
    }
    return 0;
}

export class FltExtension implements Extension<Flt> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return oneAsFlt.name;
    }
    get name(): string {
        return 'FltExtension';
    }
    get dependencies(): FEATURE[] {
        return ['Flt'];
    }
    evaluate(expr: Flt, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Flt ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Flt): boolean {
        return false;
    }
    isKind(arg: unknown): arg is Flt {
        return is_flt(arg);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Flt): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Flt): boolean {
        return true;
    }
    isZero(arg: Flt): boolean {
        return arg.isZero();
    }
    subst(expr: Flt, oldExpr: U, newExpr: U): U {
        if (is_flt(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(atom: Flt, $: ExtensionEnv): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toLatexString(atom: Flt, $: ExtensionEnv): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toListString(atom: Flt, $: ExtensionEnv): string {
        return number_to_floating_point_string(atom.d, $);
    }
    valueOf(expr: Flt): U {
        return expr;
    }
}

export const flt_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new FltExtension($);
});