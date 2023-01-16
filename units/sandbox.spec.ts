import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("derivative", function () {
    it("d(a*b,x)", function () {
        const lines: string[] = [
            `d(a*b,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* (derivative a x) b) (* a (derivative b x)))");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,x)*b+a*d(b,x)");
        engine.release();
    });
    it("d(b*a,x)", function () {
        const lines: string[] = [
            `d(b*a,x)`
        ];
        const engine = createScriptEngine({ treatAsVectors: ['a','b'] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* (derivative b x) a) (* b (derivative a x)))");
        assert.strictEqual(engine.renderAsInfix(actual), "d(b,x)*a+b*d(a,x)");
        engine.release();
    });
});
