import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("a*(b+c)", function () {
        const lines: string[] = [
            `a*(b+c)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* a c))");
        // assert.strictEqual(print_expr(actual, $), "a*b+a*c");
        assert.strictEqual(engine.renderAsInfix(actual), "a*(b+c)");

        engine.release();
    });
});
