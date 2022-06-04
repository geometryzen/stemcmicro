import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("", function () {
        const lines: string[] = [
            `float(i)`
        ];
        const engine = create_engine({
            dependencies: ['Flt', 'Imu'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "i");
        assert.strictEqual(render_as_infix(actual, $), "i");
        engine.release();
    });
    xit("E", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(render_as_infix(actual, $), "1.272020...+0.786151...*i");
        engine.release();
    });
});
