import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("predicate", function () {
    it("x==0", function () {
        const lines: string[] = [
            `x==0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(render_as_sexpr(value, $), "false");
        assert.strictEqual(render_as_infix(value, $), 'False');
    });
    it("x>0", function () {
        const lines: string[] = [
            `x>0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(render_as_sexpr(value, $), "true");
        assert.strictEqual(render_as_infix(value, $), 'True');
    });
    it("x<0", function () {
        const lines: string[] = [
            `x<0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(render_as_sexpr(value, $), "false");
        assert.strictEqual(render_as_infix(value, $), 'False');
    });
    it("x * y < 0", function () {
        const lines: string[] = [
            `x * y < 0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(render_as_sexpr(value, $), "false");
        assert.strictEqual(render_as_infix(value, $), 'False');
    });
    it("x * y > 0", function () {
        const lines: string[] = [
            `x * y > 0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(render_as_sexpr(value, $), "true");
        assert.strictEqual(render_as_infix(value, $), 'True');
    });
});
