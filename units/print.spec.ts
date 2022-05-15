import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("print", function () {
    it("A", function () {
        const lines: string[] = [
            `a^b`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "a^b");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `a|b`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "a|b");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `a*b|c`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "b|c*a");
        engine.release();
    });
    xit("D", function () {
        const lines: string[] = [
            `(a*b)|c`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "(a*b)|c");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `a*(b|c)`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "b|c*a");
        engine.release();
    });
    xit("F", function () {
        // This used to be correct, but canonicalization transforms it.
        const lines: string[] = [
            `a*b^c`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "a*b^c");
        engine.release();
    });
    xit("G", function () {
        const lines: string[] = [
            `(a*b)^c`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO should flatten to (^ a b c), or factorize back to input.
        assert.strictEqual(print_list(value, $), "(+ (^ (| a b) c) (^ (^ a b) c))");
        // assert.strictEqual(print_expr(value, $), "(a*b)^c");
        engine.release();
    });
    xit("H", function () {
        // This used to be correct, but canonicalization transforms it.
        const lines: string[] = [
            `a*(b^c)`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "a*b^c");
        engine.release();
    });
});
