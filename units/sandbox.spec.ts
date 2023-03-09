import { assert } from "chai";
import { Cons, create_script_context, create_sym, is_rat, items_to_cons, Native, native_sym, one, ScriptContext, U } from "../index";
import { ExtensionEnv, LambdaExpr } from "../src/env/ExtensionEnv";
import { divide } from "../src/helpers/divide";
import { assert_one_value_execute } from "./assert_one_value_execute";

const VERSIN = create_sym('versin');
const negOne = one.neg();

/**
 * Registers an implementation of the versin function with the environment.
 */
export function define_versin($: ScriptContext): ScriptContext {
    // If we also want to control the name as it appears in the script
    const match: U = items_to_cons(VERSIN);   // TODO 
    return $.defineFunction(match, versin_lambda);
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
        return $.subtract(one, $.evaluate(Native.cosine, x));
    }
    // If not expanding.
    // return cons(VERSIN, argList);
};

describe("exmple", function () {
    it("versin(2*pi)", function () {
        const lines: string[] = [
            `pi=tau(1)/2`,
            `versin(2*pi)`
        ];
        const rootContext = create_script_context({
        });
        const context = define_versin(rootContext);
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "0");
        context.release();
    });
});
