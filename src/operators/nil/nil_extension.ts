
import { create_str, create_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native } from "math-expression-native";
import { cons, Cons, nil, U } from "math-expression-tree";
import { diagnostic } from "../../diagnostics/diagnostics";
import { Diagnostics } from "../../diagnostics/messages";
import { Extension, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_NIL } from "../../hashing/hash_info";

class NilExtension implements Extension<Cons> {
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(expr: Cons, opr: Sym, rhs: U, env: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(expr: Cons, opr: Sym, lhs: U, env: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Cons, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.sexpr: {
                return create_str(this.toListString());
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym("nil"));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(expr: Cons, opr: Sym): boolean {
        return false;
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
    toAsciiString(): string {
        return 'nil';
    }
    toHumanString(): string {
        return 'nil';
    }
    toInfixString(): string {
        return 'nil';
    }
    toLatexString(): string {
        return 'nil';
    }
    toListString(): string {
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
