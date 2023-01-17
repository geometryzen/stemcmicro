import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("ordering", function () {
    it("a*d(b,c)", function () {
        const lines: string[] = [
            `a*d(b,c)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*d(b,c)");
        engine.release();
    });
    it("d(b,c)*a", function () {
        const lines: string[] = [
            `d(b,c)*a`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*d(b,c)");
        engine.release();
    });
    it("d(a,b)*c", function () {
        const lines: string[] = [
            `d(a,b)*c`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "c*d(a,b)");
        engine.release();
    });
});
