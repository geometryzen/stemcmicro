import { assert } from "chai";
import { render_as_infix } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("scalars", function () {
    it("", function () {
        const lines: string[] = [
            `a*b`,
        ];
        const engine = create_engine();
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "a*b");
        engine.release();
    });
    it("should not commute if known to be vectors", function () {
        const lines: string[] = [
            `b*a`,
        ];
        const engine = create_engine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "b*a");
        engine.release();
    });
    it("should commute if one is known to be a scalar.", function () {
        const lines: string[] = [
            `b*a`,
        ];
        const engine = create_engine({
            dependencies: ['Vector'],
            treatAsVectors: ['a']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "a*b");
        engine.release();
    });
    it("should commute if one is known to be a scalar.", function () {
        const lines: string[] = [
            `b*a`,
        ];
        const engine = create_engine({
            dependencies: ['Vector'],
            treatAsVectors: ['b']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "a*b");
        engine.release();
    });
    it("should commute if one is known to be a scalar.", function () {
        const lines: string[] = [
            `y*x*b*a`,
        ];
        const engine = create_engine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "b*a*x*y");
        engine.release();
    });
});
