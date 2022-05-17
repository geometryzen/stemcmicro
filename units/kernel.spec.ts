import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("kernel", function () {
    it("rat(0)", function () {
        const lines: string[] = [
            `0`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '0');
        assert.strictEqual(print_expr(actual, $), '0');
        engine.release();
    });
    it("rat(1)", function () {
        const lines: string[] = [
            `1`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '1');
        assert.strictEqual(print_expr(actual, $), '1');
        engine.release();
    });
    it("rat(2)", function () {
        const lines: string[] = [
            `2`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '2');
        assert.strictEqual(print_expr(actual, $), '2');
        engine.release();
    });
    it("add_rat_rat", function () {
        const lines: string[] = [
            `2+3`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '5');
        assert.strictEqual(print_expr(actual, $), '5');
        engine.release();
    });
    it("flt(0)", function () {
        const lines: string[] = [
            `0.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '0.0');
        assert.strictEqual(print_expr(actual, $), '0.0');
        engine.release();
    });
    it("flt(1)", function () {
        const lines: string[] = [
            `1.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '1.0');
        assert.strictEqual(print_expr(actual, $), '1.0');
        engine.release();
    });
    it("flt(2)", function () {
        const lines: string[] = [
            `2.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '2.0');
        assert.strictEqual(print_expr(actual, $), '2.0');
        engine.release();
    });
    it("add_flt_flt", function () {
        const lines: string[] = [
            `2.0+3.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '5.0');
        assert.strictEqual(print_expr(actual, $), '5.0');
        engine.release();
    });
    it("add_rat_flt", function () {
        const lines: string[] = [
            `2+3.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '5.0');
        assert.strictEqual(print_expr(actual, $), '5.0');
        engine.release();
    });
});
describe("kernel", function () {
    it("*(Flt,Flt)", function () {
        const lines: string[] = [
            `2.0*3.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '6.0');
        assert.strictEqual(print_expr(actual, $), '6.0');
        engine.release();
    });
    it("*(Rat,Rat)", function () {
        const lines: string[] = [
            `2*3`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '6');
        assert.strictEqual(print_expr(actual, $), '6');
        engine.release();
    });
    it("+(Rat,Rat)", function () {
        const lines: string[] = [
            `2+3`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '5');
        assert.strictEqual(print_expr(actual, $), '5');
        engine.release();
    });
    it("+(Flt,Flt)", function () {
        const lines: string[] = [
            `2.0+3.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 3
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '5.0');
        assert.strictEqual(print_expr(actual, $), '5.0');
        engine.release();
    });
});
