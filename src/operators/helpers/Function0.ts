import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { FunctionOperator } from "./FunctionOperator";

export abstract class Function0 extends FunctionOperator {
    constructor(name: string, opr: Sym, $: ExtensionEnv) {
        super(name, opr, $);
    }
    match(expr: U): { expr: Cons, opr: Sym } | undefined {
        if (is_cons(expr) && expr.length === 1) {
            const opr = expr.opr;
            if (is_sym(opr) && this.opr.equalsSym(opr)) {
                return { expr, opr };
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
}