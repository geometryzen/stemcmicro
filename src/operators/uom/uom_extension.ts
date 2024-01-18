import { create_rat, Uom } from "math-expression-atoms";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_UOM } from "../../hashing/hash_info";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

export function is_uom(p: U): p is Uom {
    return p instanceof Uom;
}

class UomExtension implements Extension<Uom> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_UOM;
    }
    get name(): string {
        return 'UomExtension';
    }
    get dependencies(): FEATURE[] {
        return ['Uom'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Uom, $: ExtensionEnv): U {
        throw new Error('Method not implemented.');
    }
    isKind(arg: U): arg is Uom {
        return is_uom(arg);
    }
    subst(expr: Uom, oldExpr: U, newExpr: U): U {
        if (is_uom(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(uom: Uom): string {
        // console.lg(`UomExtension.toInfixString()`);
        return uom.toInfixString();
    }
    toLatexString(uom: Uom): string {
        // console.lg(`UomExtension.toLaTeXString()`);
        return uom.toInfixString();
    }
    toListString(uom: Uom): string {
        // console.lg(`UomExtension.toListString()`);
        return uom.toString(10, false);
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        // console.lg(`UomExtension.transform()`);
        if (is_uom(expr)) {
            if (expr.isOne()) {
                return [TFLAG_DIFF, create_rat(1, 1)];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        return [TFLAG_NONE, expr];
    }
}

/**
 * The Extension for Unit of Measure.
 */
export const uom_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new UomExtension($);
});