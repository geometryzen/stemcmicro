import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("float", function () {
    it("A", function () {
        const lines: string[] = [
            `float(tau(1/2))`
        ];
        const engine = create_engine({
            dependencies: ['Flt']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "3.141593...");
        assert.strictEqual(render_as_infix(actual, $), "3.141593...");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `1+i`
        ];
        const engine = create_engine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(add 1 i)");
        assert.strictEqual(render_as_infix(actual, $), "1+i");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `1+2*i`
        ];
        const engine = create_engine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(add 1 (multiply 2 i))");
        assert.strictEqual(render_as_infix(actual, $), "1+2*i");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `(1+2*i)^(1/2)`
        ];
        const engine = create_engine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(power (+ 1 (* 2 i)) 1/2)");
        assert.strictEqual(render_as_infix(actual, $), "(1+2*i)^(1/2)");
        engine.release();
    });
    xit("E", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(render_as_infix(actual, $), "1.272020...+0.786151...*i");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `float(x)`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "x");
        assert.strictEqual(render_as_infix(actual, $), "x");
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [
            `float(pi)`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "3.141593...");
        assert.strictEqual(render_as_infix(actual, $), "3.141593...");
        engine.release();
    });
});
