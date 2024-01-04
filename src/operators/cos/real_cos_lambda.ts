
import { is_sym } from "math-expression-atoms";
import { ExprContext, LambdaExpr } from 'math-expression-context';
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { MATH_COS } from "./MATH_COS";

export const real_cos_lamba: LambdaExpr = function (argList: Cons, $: ExprContext): U {
    const env: ExtensionEnv = $ as unknown as ExtensionEnv;
    const arg = argList.car;
    if (is_sym(arg)) {
        return items_to_cons(MATH_COS, arg);
    }
    else {
        throw new Error(`${env.toInfixString(arg)}`);
    }
};