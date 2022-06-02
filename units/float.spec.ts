import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("float", function () {
    xit("D", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(print_expr(actual, $), "1.272020...+0.786151...*i");
        engine.release();
    });
});

describe("float", function () {
    it("A", function () {
        const lines: string[] = [
            `float(tau(1/2))`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "3.141593...");
        assert.strictEqual(print_expr(actual, $), "3.141593...");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [
            `1+i`
        ];
        const engine = createSymEngine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(add 1 i)");
        assert.strictEqual(print_expr(actual, $), "1+i");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `1+2*i`
        ];
        const engine = createSymEngine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(add 1 (multiply 2 i))");
        assert.strictEqual(print_expr(actual, $), "1+2*i");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `(1+2*i)^(1/2)`
        ];
        const engine = createSymEngine({ useCaretForExponentiation: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power (+ 1 (* 2 i)) 1/2)");
        assert.strictEqual(print_expr(actual, $), "(1+2*i)^(1/2)");
        engine.release();
    });
    xit("D", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(print_expr(actual, $), "1.272020...+0.786151...*iXXX");
        engine.release();
    });
});
xdescribe("float", function () {
    xit("D", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = createSymEngine({ version: 3 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(print_expr(actual, $), "1.272020...+0.786151...*i");
        engine.release();
    });
});
