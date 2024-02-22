import { Boo, booT, create_sym, is_boo, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, is_atom, nil, U } from "math-expression-tree";
import { diagnostic, Diagnostics } from "../../diagnostics/diagnostics";
import { Extension, ExtensionEnv, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";

const ADD = native_sym(Native.add);
const SIMPLIFY = native_sym(Native.simplify);

export class BooExtension implements Extension<Boo> {
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Boo, opr: Sym, env: ExprContext): boolean {
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Boo, opr: Sym, rhs: U, expr: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                return diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, ADD, create_sym(lhs.type), create_sym(rhs.type));
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Boo, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Boo, opr: Sym, argList: Cons, env: ExprContext): U {
        if (opr.equalsSym(SIMPLIFY)) {
            return target;
        }
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return booT.name;
    }
    get name(): string {
        return 'BooExtension';
    }
    evaluate(expr: Boo, argList: Cons, $: ExtensionEnv): [number, U] {
        return this.transform(cons(expr, argList), $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        if (expr instanceof Boo) {
            return [TFLAG_HALT, expr];
        }
        else {
            return [TFLAG_NONE, expr];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Boo, $: ExtensionEnv): U {
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isKind(arg: U): arg is Boo {
        return is_boo(arg);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subst(expr: Boo, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        return expr;
        // throw new Error(`Boo.subst(expr=${render_as_infix(expr, $)}, oldExpr=${render_as_infix(oldExpr, $)}, newExpr=${render_as_infix(newExpr, $)}) Method not implemented.`);
    }
    toHumanString(expr: Boo): string {
        return expr.equals(booT) ? 'true' : 'false';
    }
    toInfixString(expr: Boo): string {
        return expr.equals(booT) ? 'true' : 'false';
    }
    toLatexString(expr: Boo): string {
        return expr.equals(booT) ? 'true' : 'false';
    }
    toListString(expr: Boo): string {
        return expr.equals(booT) ? 'true' : 'false';
    }
}

export const boo_extension = mkbuilder<Boo>(BooExtension);