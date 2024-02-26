import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("log", function () {
    it("log(1)", function () {
        const lines: string[] = [
            `log(1)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("log(exp(1))", function () {
        const lines: string[] = [
            `log(exp(1))`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("log(exp(x))", function () {
        const lines: string[] = [
            `log(exp(x))`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "x");
        engine.release();
    });
    it("log(-2.0)", function () {
        const lines: string[] = [
            `log(-2.0)`,
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0.693147...+3.141593...*i");
        engine.release();
    });
    it("log(-2)", function () {
        const lines: string[] = [
            `log(-2)`,
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "log(2)+i*pi");
        engine.release();
    });
    it("log(0.0)", function () {
        const lines: string[] = [
            `log(0.0)`,
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "undefined");
        engine.release();
    });
    it("log(0)", function () {
        const lines: string[] = [
            `log(0)`,
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "undefined");
        engine.release();
    });
    it("log(-x)", function () {
        const lines: string[] = [
            `log(-x)`,
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "log(x)+i*pi");
        engine.release();
    });
    it("log(clock(i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `log(clock(i))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*i*pi");
        engine.release();
    });
});
