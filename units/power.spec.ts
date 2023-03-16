import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("Exponentiation", function () {
    it("a**b should parse", function () {
        const lines: string[] = [
            `a**b`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(expt a b)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**b');
        engine.release();
    });
    it("a^b should parse", function () {
        const lines: string[] = [
            `a^b`
        ];
        const engine = create_script_context({ useCaretForExponentiation: false });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(^ a b)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a^b');
        engine.release();
    });
    it("operator should be right-associative", function () {
        const lines: string[] = [
            `a**b**c`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(expt a (expt b c))');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**(b**c)');
        engine.release();
    });
    it("Exponentiation binds more tightly than multiplication", function () {
        const lines: string[] = [
            `a**1/2`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(* 1/2 a)');
        assert.strictEqual(engine.renderAsInfix(actual), '1/2*a');
        engine.release();
    });
    it("-1**0 is treated as -(1**0) and so evaluates to -1", function () {
        const lines: string[] = [
            `-1**0`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "-1");
        assert.strictEqual(engine.renderAsInfix(actual), "-1");
        engine.release();
    });
    it("(-1)**0", function () {
        const lines: string[] = [
            `(-1)**0`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
    it("test A", function () {
        const lines: string[] = [
            `a**1/2 + a**1/2`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), 'a');
        assert.strictEqual(engine.renderAsInfix(actual), 'a');
        engine.release();
    });
    it("test B", function () {
        const lines: string[] = [
            `2**(1/2)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(expt 2 1/2)');
        assert.strictEqual(engine.renderAsInfix(actual), '2**(1/2)');
        engine.release();
    });
    it("pre-test C.1", function () {
        const lines: string[] = [
            `3 * 1/2`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '3/2');
        assert.strictEqual(engine.renderAsInfix(actual), '3/2');
        engine.release();
    });
    it("pre-test C.2", function () {
        const lines: string[] = [
            `3/2-1`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '1/2');
        assert.strictEqual(engine.renderAsInfix(actual), '1/2');
        engine.release();
    });
    it("test C", function () {
        const lines: string[] = [
            `2**(3/2)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(expt 2 1/2)');
        assert.strictEqual(engine.renderAsInfix(actual), '2*2**(1/2)');
        engine.release();
    });
    it("test D", function () {
        const lines: string[] = [
            `(-2)**(3/2)`
        ];
        const engine = create_script_context({ useDefinitions: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '-2*i*2**(1/2)');
        engine.release();
    });
    it("test E", function () {
        const lines: string[] = [
            `a*a`
        ];
        const engine = create_script_context({ useDefinitions: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(expt a 2)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**2');
        engine.release();
    });
    it("test F", function () {
        const lines: string[] = [
            `a*a*a`
        ];
        const engine = create_script_context({ useDefinitions: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(expt a 3)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**3');
        engine.release();
    });
    it("test G", function () {
        const sourceText = [
            `(b/a)^2`,
        ].join('\n');
        const engine = create_script_context({
            useCaretForExponentiation: true,
            useDefinitions: false
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b^2/(a^2)");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* (expt a -2) (expt b 2))");
        assert.isArray(prints);
        assert.strictEqual(prints.length, 0, "prints.length");
        engine.release();
    });
    it("1^a", function () {
        const lines: string[] = [
            `1^a`,
        ];
        const engine = create_script_context({ useDefinitions: true, useCaretForExponentiation: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("1/(a+b*x)", function () {
        const lines: string[] = [
            `1/(a+b*x)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/(a+b*x)");
        engine.release();
    });
    it("1/((a+b*x)^2)", function () {
        const lines: string[] = [
            `1/((a+b*x)^2)`
        ];
        const engine = create_script_context({
            disable: [Directive.expandPowerSum],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/((a+b*x)^2)");
        engine.release();
    });
    it("1/((a+b*x)^2)", function () {
        const lines: string[] = [
            `1/((a+b*x)^2)`
        ];
        const engine = create_script_context({
            enable: [Directive.expandPowerSum],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/(2*a*b*x+b^2*x^2+a^2)");
        engine.release();
    });
    it("1/(-a-b)", function () {
        const lines: string[] = [
            `1/(-a-b)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/(a+b)");
        engine.release();
    });
    it("1/(a+b)", function () {
        const lines: string[] = [
            `1/(a+b)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/(a+b)");
        engine.release();
    });
    it("-1/(a+b)", function () {
        const lines: string[] = [
            `-1/(a+b)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/(a+b)");
        engine.release();
    });
    it("1/(a-b)", function () {
        const lines: string[] = [
            `1/(a-b)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/(a-b)");
        engine.release();
    });
    it("1/(b-a)", function () {
        const lines: string[] = [
            `1/(b-a)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/(a-b)");
        engine.release();
    });
    it("1/(-a-b)", function () {
        const lines: string[] = [
            `1/(-a-b)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/(a+b)");
        engine.release();
    });
    it("1/(-a*b-x*b^2)+1/(a*b+x*b^2)", function () {
        const lines: string[] = [
            `1/(-a*b-x*b^2)+1/(a*b+x*b^2)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("1/(b*(a+b*x))+1/(-a*b-x*b^2)", function () {
        const lines: string[] = [
            `1/(b*(a+b*x))+1/(-a*b-x*b^2)`
        ];
        const engine = create_script_context({
            disable: [Directive.factor],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
