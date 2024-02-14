
import { imu, Imu, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { HASH_IMU } from "../../hashing/hash_info";
import { MATH_IMU } from "../../runtime/ns_math";

const ISZERO = native_sym(Native.iszero);

class Builder implements ExtensionBuilder<Imu> {
    create(): Extension<Imu> {
        return new ImuExtension();
    }
}

class ImuExtension implements Extension<Imu> {
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    test(expr: Imu, opr: Sym): boolean {
        if (opr.equalsSym(ISZERO)) {
            return false;
        }
        throw new Error(`ImuExtension.test ${opr} method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_IMU;
    }
    get name(): string {
        return 'ImuExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: U): expr is Imu {
        return imu.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isnil(expr: Cons): boolean {
        return false;
    }
    subst(expr: Imu, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Imu): string {
        return 'i';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Imu): string {
        return '\\imath';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Imu, $: ExtensionEnv): string {
        return $.getSymbolPrintName(MATH_IMU);
    }
    evaluate(expr: Imu, argList: Cons): [TFLAGS, U] {
        // console.lg(this.name, "evaluate");
        return [TFLAG_HALT, cons(expr, argList)];
    }
    transform(expr: Imu): [TFLAGS, U] {
        // console.lg(this.name, "transform");
        return [TFLAG_HALT, this.valueOf(expr)];
    }
    valueOf(expr: Imu): U {
        // console.lg(this.name, "valueOf");
        // It seems as though we could respond to requests to convert the imaginary unit
        // into either clock or polar form at this level, but in the case of polar that
        // would lead to infinite recursion of i => exp(1/2*i*pi) => exp(1/2*exp(1/2*i*pi)*pi).
        // Or would it? The exp function, acting on a product is already in polar form and so
        // recursion should terminate. 
        // console.lg("clock?", this.$.getDirective(Directive.complexAsClock));
        // console.lg("polar?", this.$.getDirective(Directive.complexAsPolar));
        return expr;
    }
}

export const imu_extension_builder = new Builder();
