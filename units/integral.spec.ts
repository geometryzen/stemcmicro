import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("integral", function () {
    it("integral(1,x)", function () {
        const lines: string[] = [
            `integral(1,x)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "x");
        engine.release();
    });
    it("integral(x,x)", function () {
        const lines: string[] = [
            `integral(x,x)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*x**2");
        engine.release();
    });
    it("integral(x*x,x)", function () {
        const lines: string[] = [
            `integral(x*x,x)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/3*x**3");
        engine.release();
    });
    it("integral(1/(a+b*x),x)", function () {
        const lines: string[] = [
            `integral(1/(a+b*x),x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "log(a+b*x)/b");
        engine.release();
    });
    it("integral(1/(a+b*x)^2,x)", function () {
        const lines: string[] = [
            `integral(1/(a+b*x)^2,x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/(a*b+x*b^2)");
        engine.release();
    });
    it("1/b*1/(a+b*x)", function () {
        const lines: string[] = [
            `1/b*1/(a+b*x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/(a*b+x*b^2)");
        engine.release();
    });
    it("K+1/b*1/(a+b*x)", function () {
        const lines: string[] = [
            `K+1/b*1/(a+b*x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "K+1/(a*b+x*b^2)");
        engine.release();
    });
    it("integral(1/(a+b*x)^2,x)+1/b*1/(a+b*x)", function () {
        const lines: string[] = [
            `integral(1/(a+b*x)^2,x)+1/b*1/(a+b*x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("integral(1/(A+B*X)^2,X)+1/B*1/(A+B*X)", function () {
        const lines: string[] = [
            `integral(1/(A+B*X)^2,X)+1/B*1/(A+B*X)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
});
