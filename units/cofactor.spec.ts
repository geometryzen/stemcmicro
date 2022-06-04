import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cofactor", function () {
    it("cofactor([[1,2],[3,4]],1,1)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],1,1)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "4");
        assert.strictEqual(render_as_infix(actual, $), "4");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],1,2)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "-3");
        assert.strictEqual(render_as_infix(actual, $), "-3");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],2,1)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],2,1)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "-2");
        assert.strictEqual(render_as_infix(actual, $), "-2");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],2,2)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],2,2)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "1");
        assert.strictEqual(render_as_infix(actual, $), "1");
        engine.release();
    });
});
