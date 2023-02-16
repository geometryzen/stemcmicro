import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    xit("rationalize(1/a+1/b+1/c)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b+1/c)`
        ];
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "");
        assert.strictEqual(engine.renderAsInfix(actual), "(a*b+a*c+b*c)/(a*b*c)");
        engine.release();
    });
});
