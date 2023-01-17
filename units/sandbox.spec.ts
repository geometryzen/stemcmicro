import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("-d(c,b)*a", function () {
        const lines: string[] = [
            `-d(c,b)*a`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* -1 a (derivative c b))");
        assert.strictEqual(engine.renderAsInfix(value), "-a*d(c,b)");
        engine.release();
    });
});
