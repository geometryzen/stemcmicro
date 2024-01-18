import { is_sym, Sym } from "math-expression-atoms";
import { cons, Cons, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";

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
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'SymMathAdd';
    }
    isKind(expr: U): expr is Sym {
        if (is_sym(expr)) {
            return MATH_ADD.equalsSym(expr);
        }
        else {
            return false;
        }
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
    toLatexString(): string {
        return '+';
    }
    toListString(): string {
        return this.$.getSymbolPrintName(MATH_ADD);
    }
    evaluate(opr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(opr, argList));
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
