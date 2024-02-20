
import { Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { cons, Cons, nil, U } from "math-expression-tree";
import { Extension, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_NIL } from "../../hashing/hash_info";

class NilExtension implements Extension<Cons> {
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(expr: Cons, opr: Sym, rhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(expr: Cons, opr: Sym, lhs: U, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Cons, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Cons, opr: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_NIL;
    }
    get name(): string {
        return 'NilExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(expr: U): expr is Cons {
        return nil.equals(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isnil(expr: Cons): boolean {
        throw new Error();
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
    toHumanString(expr: Cons): string {
        return 'nil';
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
    evaluate(argList: Cons): [TFLAGS, U] {
        return this.transform(cons(nil, argList));
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

export const nil_extension_builder = mkbuilder(NilExtension);
