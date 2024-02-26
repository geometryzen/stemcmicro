import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("conj", function () {
    it("(i) should be -i", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `conj(i)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '-i');
        engine.release();
    });
    it("(1) should be 1", function () {
        const lines: string[] = [
            `conj(1)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '1');
        engine.release();
    });
    it("(1.0) should be 1.0", function () {
        const lines: string[] = [
            `conj(1.0)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '1.0');
        engine.release();
    });
    it("(x) should be x when symbols are treated as real numbers", function () {
        const lines: string[] = [
            `conj(x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), 'x');
        engine.release();
    });
    it("(-x) should be -conj(x) when symbols are treated as real numbers", function () {
        const lines: string[] = [
            `conj(-x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '-x');
        engine.release();
    });
    it("(a*b) should be conj(a)*conj(b)", function () {
        const lines: string[] = [
            `conj(a*b)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), 'a*b');
        engine.release();
    });
    it("(a*b*c) should be conj(a)*conj(b)*conj(c)", function () {
        const lines: string[] = [
            `conj(a*b*c)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), 'a*b*c');
        engine.release();
    });
});
