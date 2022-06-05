import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_sym } from "./is_sym";
import { TYPE_NAME_SYM } from "./TYPE_NAME_SYM";

class Builder implements OperatorBuilder<Sym> {
    create($: ExtensionEnv): Operator<Sym> {
        return new SymMathAdd($);
    }
}

/**
 * 
 */
class SymMathAdd implements Operator<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'SymMathAdd';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    isKind(expr: U): boolean {
        if (is_sym(expr)) {
            return MATH_ADD.equalsSym(expr);
        }
        else {
            return false;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isScalar(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVector(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isZero(expr: Sym): boolean {
        throw new Error("SymMathAdd Method not implemented.");
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    toInfixString(): string {
        return '+';
    }
    toListString(): string {
        return this.$.getSymbolToken(MATH_ADD);
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_sym(expr) && MATH_ADD.equalsSym(expr)) {
            return [TFLAG_HALT, expr];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
    valueOf(expr: Sym): Sym {
        return expr;
    }
}

export const sym_math_add = new Builder();
