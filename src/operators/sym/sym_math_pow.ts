import { assert_sym, is_sym, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, cons, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Directive, Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";

const MATH_POW = native_sym(Native.pow);

/**
 * 
 */
class SymMathPow implements Extension<Sym> {
    constructor(readonly config: Readonly<EnvConfig>) {
        // We actually know config.useCaretForExponentiation already! 
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Sym, opr: Sym): boolean {
        throw new Error("Method not implemented.");
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
        return 'SymMathPow';
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [this.isKind(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    isKind(arg: U): arg is Sym {
        return is_sym(arg) && MATH_POW.equals(arg);
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
    toInfixString(expr: Sym, $: ExtensionEnv): string {
        if ($.getDirective(Directive.useCaretForExponentiation)) {
            return '^';
        }
        else {
            return '**';
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Sym): string {
        return ' ^ ';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Sym, $: ExtensionEnv): string {
        return $.getSymbolPrintName(MATH_POW);
    }
    valueOf(expr: Sym): Sym {
        return assert_sym(this.transform(expr)[1]);
    }
}

export const sym_math_pow_builder = mkbuilder(SymMathPow);
