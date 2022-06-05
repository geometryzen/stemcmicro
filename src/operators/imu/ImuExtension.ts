
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { HASH_IMU } from "../../hashing/hash_info";
import { MATH_IMU } from "../../runtime/ns_math";
import { Cons, U } from "../../tree/tree";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new ImuExtension($);
    }
}

class ImuExtension implements Operator<Cons> {
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
    isImag(expr: Cons): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: U): boolean {
        return imu.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isNil(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Cons): boolean {
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Cons): boolean {
        return false;
    }
    subst(expr: Cons, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Cons): string {
        return 'i';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Cons): string {
        return this.$.getSymbolToken(MATH_IMU);
    }
    transform(expr: U): [TFLAGS, U] {
        if (imu.equals(expr)) {
            return [TFLAG_HALT, imu];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Cons): U {
        return imu;
    }
}

export const imuExtensionBuilder = new Builder();
