import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("integral", function () {
    xit("integral(x)", function () {
        const lines: string[] = [
            `integral(x*x,x)`
        ];
        const engine = createScriptEngine({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 1/3 (power x 3))");
        assert.strictEqual(engine.renderAsInfix(actual), "1/3*x**3");

        engine.release();
    });
});
