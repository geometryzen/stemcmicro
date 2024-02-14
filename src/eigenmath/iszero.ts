import { create_sym, Sym } from "math-expression-atoms";
import { AtomHandler, CompareFn, ExprContext } from "math-expression-context";
import { Atom, Cons, is_atom, U } from "math-expression-tree";
import { ProgramEnv } from "./ProgramEnv";

class IsZeroExprContext implements ExprContext {
    constructor(readonly env: ProgramEnv) {

    }
    handlerFor<A extends Atom>(atom: A): AtomHandler<A> {
        return this.env.handlerFor(atom);
    }
    clearBindings(): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compareFn(opr: Sym): CompareFn {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    executeProlog(script: string[]): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasBinding(opr: Sym, target: Cons): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBinding(opr: Sym, target: Cons): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setBinding(opr: Sym, binding: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasUserFunction(name: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserFunction(name: Sym): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setUserFunction(name: Sym, usrfunc: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defineUserSymbol(name: Sym): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: U): U {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDirective(directive: number): number {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pushDirective(directive: number, value: number): void {
        throw new Error("Method not implemented.");
    }
    popDirective(): void {
        throw new Error("Method not implemented.");
    }

}

/**
 * Works for expr being Rat, Flt, or Tensor.
 */
export function iszero(atom: U, env: ProgramEnv): boolean {
    if (is_atom(atom)) {
        const handler = env.handlerFor(atom);
        return handler.test(atom, create_sym("iszero"), new IsZeroExprContext(env));
    }
    else {
        return false;
    }
    /*
    if (is_rat(expr)) {
        return expr.isZero();
    }

    if (is_flt(expr)) {
        return expr.d === 0;
    }

    if (is_tensor(expr)) {
        const n = expr.nelem;
        for (let i = 0; i < n; i++) {
            if (!iszero(expr.elems[i]))
                return false;
        }
        return true;
    }

    return false;
    */
}
