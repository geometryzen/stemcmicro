import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("conj", function () {
    it("(1) should be 1", function () {
        const lines: string[] = [
            `conj(1)`
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), '1');
        engine.release();
    });
    it("(x) should be x when symbols are treated as real numbers", function () {
        const lines: string[] = [
            `conj(x)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), 'x');
        engine.release();
    });
    it("", function () {
        const lines: string[] = [
            `conj(y|x)`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x|y");
        engine.release();
    });
});
