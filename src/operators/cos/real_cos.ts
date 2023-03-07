
import { ExtensionEnv, LambdaExpr } from "../../env/ExtensionEnv";
import { Cons, items_to_cons } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { MATH_COS } from "./MATH_COS";

export const real_cos: LambdaExpr = function (argList: Cons, $: ExtensionEnv) {
    const arg = argList.car;
    if (is_sym(arg)) {
        return items_to_cons(MATH_COS, arg);
    }
    else {
        throw new Error(`${$.toInfixString(arg)}`);
    }
};