import { is_sym, Sym } from "math-expression-atoms";
import { Cons, is_cons, U } from "math-expression-tree";
import { FunctionVarArgs } from "./FunctionVarArgs";

export abstract class Function0 extends FunctionVarArgs<Cons> {
    constructor(name: string, opr: Sym) {
        super(name, opr);
    }
    match(expr: U): { expr: Cons; opr: Sym } | undefined {
        if (is_cons(expr) && expr.length === 1) {
            const opr = expr.opr;
            if (is_sym(opr) && this.opr.equalsSym(opr)) {
                return { expr, opr };
            } else {
                return void 0;
            }
        } else {
            return void 0;
        }
    }
}
