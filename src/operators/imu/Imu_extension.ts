
import { Imu } from "../../..";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_IMU } from "../../hashing/hash_info";
import { MATH_IMU } from "../../runtime/ns_math";
import { cons, Cons, U } from "../../tree/tree";

class Builder implements OperatorBuilder<Imu> {
    create($: ExtensionEnv): Operator<Imu> {
        return new ImuExtension($);
    }
}

class ImuExtension implements Operator<Imu> {
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return imu.name;
    }
    get hash(): string {
        return HASH_IMU;
    }
    get name(): string {
        return 'ImuExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Imu): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: U): expr is Imu {
        return imu.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Imu): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Imu): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isNil(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Imu): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Imu): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Imu): boolean {
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
    toListString(expr: Imu): string {
        return this.$.getSymbolToken(MATH_IMU);
    }
    evaluate(expr: Imu, argList: Cons): [TFLAGS, U] {
        return [TFLAG_HALT, cons(expr, argList)];
    }
    transform(expr: Imu): [TFLAGS, U] {
        return [TFLAG_HALT, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Imu): U {
        return expr;
    }
}

export const imu_extension = new Builder();
