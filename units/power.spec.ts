import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { VERSION_LATEST, VERSION_ONE } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("test D", function () {
        const lines: string[] = [
            `(-2)**(3/2)`
        ];
        const engine = create_engine({ useDefinitions: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(power 2 1/2)');
        assert.strictEqual(render_as_infix(actual, $), '-2*2**(1/2)*i');
        engine.release();
    });
});

describe("Exponentiation", function () {
    it("a**b should parse", function () {
        const lines: string[] = [
            `a**b`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(power a b)');
        assert.strictEqual(render_as_infix(actual, $), 'a**b');
        engine.release();
    });
    it("a^b should parse for version 1", function () {
        const lines: string[] = [
            `a^b`
        ];
        const engine = create_engine({ version: VERSION_ONE });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(outer a b)');
        assert.strictEqual(render_as_infix(actual, $), 'a^b');
        engine.release();
    });
    it("operator should be right-associative", function () {
        const lines: string[] = [
            `a**b**c`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(power a (power b c))');
        assert.strictEqual(render_as_infix(actual, $), 'a**(b**c)');
        engine.release();
    });
    it("Exponentiation binds more tightly than multiplication", function () {
        const lines: string[] = [
            `a**1/2`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(* 1/2 a)');
        assert.strictEqual(render_as_infix(actual, $), '1/2*a');
        engine.release();
    });
    it("test A", function () {
        const lines: string[] = [
            `a**1/2 + a**1/2`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), 'a');
        assert.strictEqual(render_as_infix(actual, $), 'a');
        engine.release();
    });
    it("test B", function () {
        const lines: string[] = [
            `2**(1/2)`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(power 2 1/2)');
        assert.strictEqual(render_as_infix(actual, $), '2**(1/2)');
        engine.release();
    });
    it("pre-test C.1", function () {
        const lines: string[] = [
            `3 * 1/2`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '3/2');
        assert.strictEqual(render_as_infix(actual, $), '3/2');
        engine.release();
    });
    it("pre-test C.2", function () {
        const lines: string[] = [
            `3/2-1`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '1/2');
        assert.strictEqual(render_as_infix(actual, $), '1/2');
        engine.release();
    });
    it("test C", function () {
        const lines: string[] = [
            `2**(3/2)`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(power 2 1/2)');
        assert.strictEqual(render_as_infix(actual, $), '2*2**(1/2)');
        engine.release();
    });
    it("test D", function () {
        const lines: string[] = [
            `(-2)**(3/2)`
        ];
        const engine = create_engine({ useDefinitions: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(power 2 1/2)');
        assert.strictEqual(render_as_infix(actual, $), '-2*2**(1/2)*i');
        engine.release();
    });
});
