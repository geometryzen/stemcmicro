import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("simplify", function () {
    it("simplify(exp(-3/4*i*pi))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `simplify(exp(-3/4*i*pi))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/2*2^(1/2)*(1+i)");

        engine.release();
    });
    // This currently loops because clockform calls abs which goes to inner product and nothing gets any simpler.
    it("cos(x)^2+sin(x)^2", function () {
        const lines: string[] = [
            `simplify(cos(x)^2+sin(x)^2)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
});
