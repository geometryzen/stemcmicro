import { Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, U } from "math-expression-tree";
import { ExtensionEnv, FEATURE, Operator, OperatorBuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { MATH_PI } from "../../runtime/ns_math";
import { is_pi } from "../pi/is_pi";
import { assert_sym } from "./assert_sym";

const ISZERO = native_sym(Native.iszero);

class Builder implements OperatorBuilder<Sym> {
    create($: ExtensionEnv): Operator<Sym> {
        return new SymMathPi($);
    }
}

/**
 * 
 */
class SymMathPi implements Operator<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    test(expr: Sym, opr: Sym): boolean {
        if (opr.equalsSym(ISZERO)) {
            return false;
        }
        throw new Error(`SymMathPi.test ${opr} Method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'SymMathPi';
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [this.isKind(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    isKind(expr: U): expr is Sym {
        return is_pi(expr);
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Sym): string {
        return this.$.getSymbolPrintName(MATH_PI);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Sym): string {
        // console.lg(`SymMathPi.toLatexString ${expr}`);
        return '\\pi';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Sym): string {
        return this.$.getSymbolPrintName(MATH_PI);
    }
    valueOf(expr: Sym): Sym {
        return assert_sym(this.transform(expr)[1]);
    }
}

export const sym_math_pi = new Builder();
