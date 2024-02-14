import { Extension, ExtensionBuilder, ExtensionEnv, FEATURE, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { cons, Cons, U } from "../../tree/tree";
import { assert_sym } from "./assert_sym";
import { is_sym } from "./is_sym";

class Builder implements ExtensionBuilder<Sym> {
    create(): Extension<Sym> {
        return new SymMathMul();
    }
}

/**
 * 
 */
class SymMathMul implements Extension<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor() {
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
    toInfixString(opr: Sym, $: ExtensionEnv): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(opr: Sym, $: ExtensionEnv): string {
        return '*';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(opr: Sym, $: ExtensionEnv): string {
        return $.getSymbolPrintName(MATH_MUL);
    }
    valueOf(opr: Sym): Sym {
        return assert_sym(this.transform(opr)[1]);
    }
}

export const sym_math_mul_builder = new Builder();
