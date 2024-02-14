import { create_int, is_uom, Sym, Uom } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_UOM } from "../../hashing/hash_info";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

class UomExtension implements Extension<Uom>, AtomHandler<Uom> {
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(uom: Uom, opr: Sym, env: ExprContext): boolean {
        return false;
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
    subst(uom: Uom, oldExpr: U, newExpr: U): U {
        if (is_uom(oldExpr)) {
            if (uom.equals(oldExpr)) {
                return newExpr;
            }
        }
        return uom;
    }
    toInfixString(uom: Uom): string {
        return uom.toInfixString();
    }
    toLatexString(uom: Uom): string {
        return uom.toInfixString();
    }
    toListString(uom: Uom): string {
        return uom.toString(10, false);
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_uom(expr)) {
            if (expr.isOne()) {
                return [TFLAG_DIFF, create_int(1)];
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
export const uom_extension = new ExtensionOperatorBuilder(function () {
    return new UomExtension();
});