import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("conj", function () {
    it("(1) should be 1", function () {
        const lines: string[] = [
            `conj(1)`
        ];
        const engine = createScriptEngine({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '1');
        engine.release();
    });
    it("(x) should be x when symbols are treated as real numbers", function () {
        const lines: string[] = [
            `conj(x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), 'x');
        engine.release();
    });
    it("(-x) should be -conj(x) when symbols are treated as real numbers", function () {
        const lines: string[] = [
            `conj(-x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '-x');
        engine.release();
    });
    it("(a*b) should be conj(a)*conj(b)", function () {
        const lines: string[] = [
            `conj(a*b)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), 'a*b');
        engine.release();
    });
});
