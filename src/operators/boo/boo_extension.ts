import { Boo, booT, is_boo, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

export class BooExtension implements Extension<Boo>, AtomHandler<Boo> {
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Boo, opr: Sym, env: ExprContext): boolean {
        return false;
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

export const boo_extension = new ExtensionOperatorBuilder(function () {
    return new BooExtension();
});