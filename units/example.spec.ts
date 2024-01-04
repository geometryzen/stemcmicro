import { assert } from "chai";
import {
    Cons,
    create_script_context,
    create_sym, ExtensionEnv,
    is_rat,
    items_to_cons,
    LambdaExpr,
    Native,
    native_sym,
    one,
    ScriptContext,
    ScriptContextOptions,
    SyntaxKind,
    U
} from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("example", function () {
    it("Geometric Algebra", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["i","j","k"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `C = Cx * e1 + Cy * e2 + Cz * e3`,
            `cross(A,B)`,
            `A|B`,
            `A^B`
        ];
        const sourcetText = lines.join('\n');
        const options: ScriptContextOptions = {
            syntaxKind: SyntaxKind.Native,
            useCaretForExponentiation: false,
            useDefinitions: false
        };
        const context = create_script_context(options);
        const { values } = context.executeScript(sourcetText);
        assert.strictEqual(context.renderAsInfix(values[0]), "Ay*Bz*i-Az*By*i-Ax*Bz*j+Az*Bx*j+Ax*By*k-Ay*Bx*k");
        assert.strictEqual(context.renderAsInfix(values[1]), "Ax*Bx+Ay*By+Az*Bz");
        assert.strictEqual(context.renderAsInfix(values[2]), "Ax*By*i^j-Ay*Bx*i^j+Ax*Bz*i^k-Az*Bx*i^k+Ay*Bz*j^k-Az*By*j^k");
        context.release();
    });
});

const VERSIN = create_sym('versin');
const negOne = one.neg();

/**
 * Registers an implementation of the versin function with the environment.
 */
export function define_versin($: ScriptContext): void {
    // If we also want to control the name as it appears in the script
    const match: U = items_to_cons(VERSIN);   // TODO 
    $.defineFunction(match, versin_lambda);
}

const versin_lambda: LambdaExpr = (argList: Cons, $: ExtensionEnv) => {
    const x = argList.head;
    // versin(n*pi) = 1 - (-1)**n
    const pi = native_sym(Native.PI);
    const n = $.divide(x, pi);
    if (is_rat(n) && n.isInteger()) {
        return $.subtract(one, $.power(negOne, n));
    }
    else {
        // versin(x) = 1 - cos(x)
        return $.subtract(one, $.cos(x));
    }
};

describe("versin", function () {
    it("versin(x)", function () {
        const lines: string[] = [
            `versin(x)`
        ];
        const context = create_script_context({
        });
        define_versin(context);
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "1-cos(x)");
        context.release();
    });
    it("versin(pi)", function () {
        const lines: string[] = [
            `pi=tau(1)/2`,
            `versin(pi)`
        ];
        const context = create_script_context({
        });
        define_versin(context);
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "2");
        context.release();
    });
    it("versin(2*pi)", function () {
        const lines: string[] = [
            `pi=tau(1)/2`,
            `versin(2*pi)`
        ];
        const context = create_script_context({
        });
        define_versin(context);
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "0");
        context.release();
    });
});
