import { assert } from "chai";
import { render_as_infix } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("print", function () {
    it("A", function () {
        const lines: string[] = [
            `a^b`,
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "a^b");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `a|b`,
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "a|b");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `a*b|c`,
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "b|c*a");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `a*(b|c)`,
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "b|c*a");
        engine.release();
    });
    it("F", function () {
        // This used to be correct, but canonicalization transforms it.
        const lines: string[] = [
            `a*b^c`,
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(value, $), "a*b^c");
        engine.release();
    });
});
