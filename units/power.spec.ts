import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { VERSION_LATEST, VERSION_ONE } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("operator should be right-associative", function () {
        const lines: string[] = [
            `a**b**c`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '(power a (power b c))');
        assert.strictEqual(print_expr(actual, $), 'a**(b**c)');
        engine.release();
    });
});

describe("Exponentiation", function () {
    it("a**b should parse", function () {
        const lines: string[] = [
            `a**b`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '(power a b)');
        assert.strictEqual(print_expr(actual, $), 'a**b');
        engine.release();
    });
    it("a^b should parse for version 1", function () {
        const lines: string[] = [
            `a^b`
        ];
        const engine = createSymEngine({ version: VERSION_ONE });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '(^ a b)');
        assert.strictEqual(print_list(actual, $), '(^ a b)');
        assert.strictEqual(print_expr(actual, $), 'a^b');
        engine.release();
    });
    it("operator should be right-associative", function () {
        const lines: string[] = [
            `a**b**c`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '(power a (power b c))');
        assert.strictEqual(print_expr(actual, $), 'a**(b**c)');
        engine.release();
    });
    it("Exponentiation binds more tightly than multiplication", function () {
        const lines: string[] = [
            `a**1/2`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '(* 1/2 a)');
        assert.strictEqual(print_expr(actual, $), '1/2*a');
        engine.release();
    });
    it("test A", function () {
        const lines: string[] = [
            `a**1/2 + a**1/2`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), 'a');
        assert.strictEqual(print_expr(actual, $), 'a');
        engine.release();
    });
    it("test B", function () {
        const lines: string[] = [
            `2**(1/2)`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '(power 2 1/2)');
        assert.strictEqual(print_expr(actual, $), '2**(1/2)');
        engine.release();
    });
    it("pre-test C.1", function () {
        const lines: string[] = [
            `3 * 1/2`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '3/2');
        assert.strictEqual(print_expr(actual, $), '3/2');
        engine.release();
    });
    it("pre-test C.2", function () {
        const lines: string[] = [
            `3/2-1`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), '1/2');
        assert.strictEqual(print_expr(actual, $), '1/2');
        engine.release();
    });
    it("test C", function () {
        const lines: string[] = [
            `2**(3/2)`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(power 2 1/2)');
        assert.strictEqual(print_expr(actual, $), '2*2**(1/2)');
        engine.release();
    });
    xit("test D", function () {
        const lines: string[] = [
            `(-2)**(3/2)`
        ];
        const engine = createSymEngine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(power 2 1/2)');
        assert.strictEqual(print_expr(actual, $), 'i*2**(1/2)');
        engine.release();
    });
});
