import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("scalars", function () {
    it("", function () {
        const lines: string[] = [
            `a*b`,
        ];
        const engine = createScriptEngine();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
    it("should not commute if known to be vectors", function () {
        const lines: string[] = [
            `b*a`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "b*a");
        engine.release();
    });
    it("should commute if one is known to be a scalar.", function () {
        const lines: string[] = [
            `b*a`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
    it("should commute if one is known to be a scalar.", function () {
        const lines: string[] = [
            `b*a`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['b']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
    it("should commute if one is known to be a scalar.", function () {
        const lines: string[] = [
            `y*x*b*a`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "b*a*x*y");
        engine.release();
    });
});
