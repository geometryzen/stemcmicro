import { ExtensionEnv, LambdaExpr } from "../../env/ExtensionEnv";
import { divide } from "../../helpers/divide";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { negOne, one } from "../../tree/rat/Rat";
import { create_sym } from "../../tree/sym/Sym";
import { Cons, items_to_cons, U } from "../../tree/tree";
import { is_rat } from "../rat/is_rat";

const VERSIN = create_sym('versin');

/**
 * Registers an implementation of the versin function with the environment.
 */
export function define_versin($: ExtensionEnv): void {
    // If we also want to control the name as it appears in the script
    const match: U = items_to_cons(VERSIN);   // TODO 
    $.defineFunction(match, versin_lambda);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const versin_lambda: LambdaExpr = (argList: Cons, $: ExtensionEnv) => {
    // If we are asked to expand...
    const x = argList.head;
    // const x_and_pi = items_to_cons(x, pi);
    // TODO: A binary convenience function would be good.
    // And if we evaluate divide, we need the handler for it.
    // versin(n*pi) = 1 - (-1)**n
    const pi = native_sym(Native.PI);
    // TODO: We should be able to do this using the native operators.
    const n = divide(x, pi, $);
    if (is_rat(n) && n.isInteger()) {
        // We didn't have to do it this way; cos know how to simplify cos(n*pi).
        // However, it does allow us to simplify without expanding versin in terms of cos.
        return $.subtract(one, $.power(negOne, n));
    }
    else {
        // versin(x) = 1 - cos(x)
        return $.subtract(one, $.evaluate(Native.cosine, argList));
    }
    // If not expanding.
    // return cons(VERSIN, argList);
};