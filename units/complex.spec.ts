import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("complex", function () {
    it("I", function () {
        const lines: string[] = [
            `bake=1`,
            `implicate=1`,
            `y*x*i*2`,
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "2*i*x*y");
        engine.release();
    });
});

describe("complex", function () {
    it("A", function () {
        const lines: string[] = [
            `x+i*y`,
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x+i*y");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `x+y*i`,
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x+i*y");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `i*y+x`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x+i*y");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `y*i+x`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x+i*y");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `i*i`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "-1");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `(-i)*i`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "1");
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [
            `(-i)+i`,
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "0");
        engine.release();
    });
    it("H", function () {
        const lines: string[] = [
            `i+(-i)`,
        ];
        const engine = createSymEngine({});
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "0");
        engine.release();
    });
    it("I", function () {
        const lines: string[] = [
            `y*x*i*2*a`,
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "2*i*a*x*y");
        engine.release();
    });
    it("J", function () {
        const lines: string[] = [
            `y*x*i*2*a`,
        ];
        const engine = createSymEngine({ useDefinitions: false });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "2*a*i*x*y");
        engine.release();
    });
});
