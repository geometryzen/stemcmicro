import { epsilon, Hyp, is_hyp, Sym } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_for_atom } from "../../hashing/hash_info";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";

function verify_hyp(hyp: Hyp): Hyp | never {
    if (is_hyp(hyp)) {
        return hyp;
    }
    else {
        throw new Error();
    }
}

class HypExtension implements Extension<Hyp>, AtomHandler<Hyp> {
    readonly #hash: string = hash_for_atom(verify_hyp(epsilon));
    constructor() {
        // Nothing to see here.
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Hyp, opr: Sym, expr: ExprContext): boolean {
        return false;
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash() {
        return this.#hash;
    }
    get name() {
        return 'HypExtension';
    }
    evaluate(hyp: Hyp, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(hyp, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Hyp ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(hyp: Hyp, $: ExtensionEnv): U {
        throw new Error("Hyp Method not implemented.");
    }
    isKind(arg: U): arg is Hyp {
        return is_hyp(arg);
    }
    subst(expr: Hyp, oldExpr: U, newExpr: U): U {
        if (this.isKind(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(hyp: Hyp, $: ExtensionEnv): string {
        return hyp.printname;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(hyp: Hyp, $: ExtensionEnv): string {
        return hyp.printname;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(hyp: Hyp, $: ExtensionEnv): string {
        return hyp.printname;
    }
}

/**
 * The hyperreal Extension.
 */
export const hyp_extension = new ExtensionOperatorBuilder(function () {
    return new HypExtension();
});