import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cofactor", function () {
    it("cofactor([[1,2],[3,4]],1,1)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],1,1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "4");
        assert.strictEqual(print_expr(actual, $), "4");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],1,2)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "-3");
        assert.strictEqual(print_expr(actual, $), "-3");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],2,1)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],2,1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "-2");
        assert.strictEqual(print_expr(actual, $), "-2");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],2,2)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],2,2)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "1");
        assert.strictEqual(print_expr(actual, $), "1");
        engine.release();
    });
});
