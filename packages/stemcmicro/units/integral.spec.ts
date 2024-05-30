import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("integral", function () {
    it("integral(1,x)", function () {
        const lines: string[] = [`integral(1,x)`];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "x");
        engine.release();
    });
    it("integral(x,x)", function () {
        const lines: string[] = [`integral(x,x)`];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*x**2");
        engine.release();
    });
    it("integral(x*x,x)", function () {
        const lines: string[] = [`integral(x*x,x)`];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/3*x**3");
        engine.release();
    });
    it("integral(1/(a+b*x),x)", function () {
        const lines: string[] = [`integral(1/(a+b*x),x)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "log(a+b*x)/b");
        engine.release();
    });
    it("integral(1/(a+b*x)^2,x)", function () {
        const lines: string[] = [`integral(1/(a+b*x)^2,x)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/(a*b+b^2*x)");
        engine.release();
    });
    it("1/b*1/(a+b*x)", function () {
        const lines: string[] = [`1/b*1/(a+b*x)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/(b*(a+b*x))");
        engine.release();
    });
    it("K+1/b*1/(a+b*x)", function () {
        const lines: string[] = [`K+1/b*1/(a+b*x)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "K+1/(b*(a+b*x))");
        engine.release();
    });
    it("integral(1/(a+b*x)^2,x)", function () {
        const lines: string[] = [`integral(1/(a+b*x)^2,x)`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/(a*b+b^2*x)");
        engine.release();
    });
});
