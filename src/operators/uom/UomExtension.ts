import { Extension, ExtensionEnv, FEATURE, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_UOM } from "../../hashing/hash_info";
import { U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

export function is_uom(p: U): p is Uom {
    return p instanceof Uom;
}

class UomExtension implements Extension<Uom> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return Uom.ONE.name;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Uom): boolean {
        return false;
    }
    isKind(arg: U): arg is Uom {
        return is_uom(arg);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(arg: Uom): false {
        return false;
    }
    isOne(arg: Uom): boolean {
        // TODO: We can have a dimensionless unit, but maybe we should avoid that?
        // It would make expression simplification easier by avoiding redundancy.
        return arg.isOne();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Uom): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Uom): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Uom): boolean {
        return false;
    }
    isZero(): boolean {
        // A Unit is never zero becuse it has no weighting factor.
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Uom, $: ExtensionEnv): Uom {
        // Uom does not have a zero value.
        throw new Error();
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
        return uom.toInfixString();
    }
    toLatexString(uom: Uom): string {
        // TODO: Can we do better?
        return uom.toInfixString();
    }
    toListString(uom: Uom): string {
        return uom.toListString();
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_uom(expr)) {
            return [TFLAG_HALT, expr];
        }
        return [TFLAG_NONE, expr];
    }
}

/**
 * The Extension for Unit of Measure.
 */
export const uomExtensionBuilder = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new UomExtension($);
});