import { assert_sym, create_sym, is_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { diagnostic, Diagnostics } from "../../diagnostics/diagnostics";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";

/**
 * 
 */
class SymMathMul implements Extension<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(readonly config: Readonly<EnvConfig>) {
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(expr: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(expr: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
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
        return 'SymMathMul';
    }
    evaluate(opr: Sym, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return $.transform(cons(opr, argList));
    }
    transform(opr: Sym): [TFLAGS, U] {
        return [this.isKind(opr) ? TFLAG_HALT : TFLAG_NONE, opr];
    }
    isKind(expr: U): expr is Sym {
        return is_sym(expr) && MATH_MUL.equals(expr);
    }
    subst(opr: Sym, oldExpr: U, newExpr: U): U {
        if (opr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return opr;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toHumanString(opr: Sym, $: ExprContext): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(opr: Sym, $: ExprContext): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(opr: Sym, $: ExprContext): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(opr: Sym, $: ExprContext): string {
        return $.getSymbolPrintName(MATH_MUL);
    }
    valueOf(opr: Sym): Sym {
        return assert_sym(this.transform(opr)[1]);
    }
}

export const sym_math_mul_builder = mkbuilder(SymMathMul);
