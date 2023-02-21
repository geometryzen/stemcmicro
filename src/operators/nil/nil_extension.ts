
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_NIL } from "../../hashing/hash_info";
import { Cons, nil, U } from "../../tree/tree";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new NilExtension($);
    }
}

class NilExtension implements Operator<Cons> {
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return nil.name;
    }
    get hash(): string {
        return HASH_NIL;
    }
    get name(): string {
        return 'NilExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Cons): boolean {
        throw new Error("Nil Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: U): boolean {
        return nil.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Cons): boolean {
        throw new Error("Nil Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Cons): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isNil(expr: Cons): boolean {
        throw new Error("Nil Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Cons): boolean {
        throw new Error("Nil Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Cons): boolean {
        throw new Error("Nil Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Cons): boolean {
        throw new Error("Nil Method not implemented.");
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
        return 'nil';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Cons): string {
        return 'nil';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Cons): string {
        return '()';
    }
    transform(expr: U): [TFLAGS, U] {
        if (nil.equals(expr)) {
            return [TFLAG_HALT, nil];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Cons): U {
        return nil;
    }
}

export const nil_extension = new Builder();
