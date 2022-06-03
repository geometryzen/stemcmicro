import { CostTable } from "../../env/CostTable";
import { Extension, ExtensionEnv, Sign, SIGN_EQ, SIGN_GT, SIGN_LT, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Err, oops } from "../../tree/err/Err";
import { U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

export function error_compare(lhs: Err, rhs: Err): Sign {
    const str1 = lhs.message;
    const str2 = rhs.message;
    if (str1 === str2) {
        return SIGN_EQ;
    }
    else if (str1 > str2) {
        return SIGN_GT;
    }
    else {
        return SIGN_LT;
    }
}

export class ErrExtension implements Extension<Err> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return oops.name;
    }
    get name(): string {
        return 'ErrExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cost(expr: Err, costs: CostTable, depth: number, $: ExtensionEnv): number {
        return 1;
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Err ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Err, $: ExtensionEnv): U {
        throw new Err("ErrExtension.valueOf Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Err): boolean {
        throw new Err("ErrExtension.isImag Method not implemented.");
    }
    isKind(arg: unknown): arg is Err {
        return arg instanceof Err;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(arg: Err, $: ExtensionEnv): boolean {
        throw new Err("ErrExtension.isMinusOne Method not implemented.");
    }
    isOne(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Err): boolean {
        throw new Err("ErrExtension.isReal Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Err): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Err): boolean {
        return false;
    }
    isZero(): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Err, $: ExtensionEnv): Err {
        // Err does not have a zero value.
        throw new Err('Err does not have a zero value');
    }
    subst(expr: Err, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Err, $: ExtensionEnv): string {
        return expr.message;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Err, $: ExtensionEnv): string {
        return expr.message;
    }
}

export const error = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new ErrExtension($);
});