import { assert } from "chai";
import { render_as_infix } from "../src/print/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("conj", function () {
    it("(1) should be 1", function () {
        const lines: string[] = [
            `conj(1)`
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(actual, $), '1');
        engine.release();
    });
    it("(x) should be x when symbols are treated as real numbers", function () {
        const lines: string[] = [
            `conj(x)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(actual, $), 'x');
        engine.release();
    });
    it("", function () {
        const lines: string[] = [
            `conj(y|x)`,
        ];
        const engine = create_engine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "x|y");
        engine.release();
    });
});
