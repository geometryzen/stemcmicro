import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("print", function () {
    it("A", function () {
        const lines: string[] = [
            `a^b`,
        ];
        const engine = createScriptEngine({ treatAsVectors: ['a', 'b'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a^b");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `a|b`,
        ];
        const engine = createScriptEngine({ treatAsVectors: ['a', 'b'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a|b");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `a*b|c`,
        ];
        const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "b|c*a");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `a*(b|c)`,
        ];
        const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "b|c*a");
        engine.release();
    });
    it("F", function () {
        // This used to be correct, but canonicalization transforms it.
        const lines: string[] = [
            `a*b^c`,
        ];
        const engine = createScriptEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*b^c");
        engine.release();
    });
});
