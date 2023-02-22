import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine } from "../index";

describe("sandbox", function () {
    it("b*c+a", function () {
        const lines: string[] = [
            `b*c+a`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

        engine.release();
    });
});
