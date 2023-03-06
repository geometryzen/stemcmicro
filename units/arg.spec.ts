import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("arg", function () {
    it("arg(a)", function () {
        const lines: string[] = [
            `arg(a)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arg(a)");
        engine.release();
    });
    it("arg(a/b)", function () {
        const lines: string[] = [
            `arg(a/b)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arg(a)-arg(b)");
        engine.release();
    });
    it("arg(x+i*y)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg(x+i*y)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(y/x)");
        engine.release();
    });
    xit("arg((a+i*b)/(c+i*d))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `arg((a+i*b)/(c+i*d))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "arctan(a/b)-arctan(c/d)");
        engine.release();
    });
    // FIXME
    xit("arg(exp(i*pi/3))", function () {
        const lines: string[] = [
            `arg(exp(i*pi/3))`,
        ];
        const engine = create_script_context({
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/3*pi");
        engine.release();
    });
});
