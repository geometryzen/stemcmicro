
import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../index";

describe("sandbox", function () {
    it("simplification", function () {
        const lines: string[] = [
            `(a*b)/(a*b)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("simplification", function () {
        const lines: string[] = [
            `(a*b(x))/(a*b(x))`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("simplification", function () {
        const lines: string[] = [
            `(x(theta)**2)/(x(theta)**2)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("simplification", function () {
        const lines: string[] = [
            `(k*x(theta)**2)/(k*x(theta)**2)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("simplification", function () {
        const lines: string[] = [
            `(k*x(theta))/(k*x(theta))`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("simplification", function () {
        const lines: string[] = [
            `(r**4*sin(theta)**2)/(r**4*sin(theta)**2)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
});