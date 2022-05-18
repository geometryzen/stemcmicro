import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("predicate", function () {
    it("x==0", function () {
        const lines: string[] = [
            `x==0`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(print_list(value, $), "false");
        assert.strictEqual(print_expr(value, $), 'False');
    });
    it("x>0", function () {
        const lines: string[] = [
            `x>0`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(print_list(value, $), "true");
        assert.strictEqual(print_expr(value, $), 'True');
    });
    it("x<0", function () {
        const lines: string[] = [
            `x<0`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(print_list(value, $), "false");
        assert.strictEqual(print_expr(value, $), 'False');
    });
    it("x * y < 0", function () {
        const lines: string[] = [
            `x * y < 0`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(print_list(value, $), "false");
        assert.strictEqual(print_expr(value, $), 'False');
    });
    it("x * y > 0", function () {
        const lines: string[] = [
            `x * y > 0`
        ];
        const engine = createSymEngine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(print_list(value, $), "true");
        assert.strictEqual(print_expr(value, $), 'True');
    });
});
