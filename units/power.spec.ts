import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
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
        assert.strictEqual(engine.renderAsSExpr(actual), '(pow a b)');
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
        assert.strictEqual(engine.renderAsSExpr(actual), '(pow a (pow b c))');
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
        assert.strictEqual(engine.renderAsSExpr(actual), '(pow 2 1/2)');
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
        // assert.strictEqual(print_list(actual,$), '(pow 2 1/2)');
        assert.strictEqual(engine.renderAsInfix(actual), '2*2**(1/2)');
        engine.release();
    });
    it("test D", function () {
        const lines: string[] = [
            `(-2)**(3/2)`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '-2*2**(1/2)*i');
        engine.release();
    });
    it("test E", function () {
        const lines: string[] = [
            `a*a`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(pow a 2)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**2');
        engine.release();
    });
    it("test F", function () {
        const lines: string[] = [
            `a*a*a`
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(pow a 3)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a**3');
        engine.release();
    });
    it("test G", function () {
        const sourceText = [
            `(b/a)^2`,
        ].join('\n');
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values, prints } = engine.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b^2/(a^2)");
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* (pow a -2) (pow b 2))");
        assert.isArray(prints);
        assert.strictEqual(prints.length, 0, "prints.length");
        engine.release();
    });
    it("1^a", function () {
        const lines: string[] = [
            `1^a`,
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
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
            disable: [Directive.expandPowSum],
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
            enable: [Directive.expandPowSum],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
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
            disable: [Directive.factoring],
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});

describe("Free Body Diagram", function () {
    it("A", function () {
        const lines: string[] = [
            `1/(1/x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.simplify(engine.valueOf(tree));
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "x");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `G20=algebra([1],["e"])`,
            `e=G20[1]`,
            `1/e`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.simplify(engine.valueOf(tree));
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `G20=algebra([1],["e"])`,
            `e=G20[1]`,
            `1/(1/e)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.simplify(engine.valueOf(tree));
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "e");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])`,
            `e1=G20[1]`,
            `e2=G20[2]`,
            `ag = g * (-e2)`,
            `Fg = m * ag`,
            `es=cos(theta)*e1+sin(theta)*e2`,
            `en=-sin(theta)*e1+cos(theta)*e2`,
            `Fn=K*en`,
            `Fs=S*es`,
            `Fnet=Fn+Fs+Fg`,
            `S=S-simplify(es|Fnet)`,
            `K=K-simplify(en|Fnet)`,
            `Fn=K*en`,
            `Fs=S*es`,
            `Fn`,
            `Fs`,
            `Fg`,
            `Fnet=simplify(Fn+Fs+Fg)`,
            `scaling=g*m`,
            `float(Fg/scaling)`,
            `float(Fn/scaling)`,
            `float(Fs/scaling)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 6);
        // Fn
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-g*m*cos(theta)*sin(theta)*e1+g*m*cos(theta)**2*e2");
        // Fs
        assert.strictEqual(engine.renderAsString(values[1], { format: 'Infix' }), "g*m*cos(theta)*sin(theta)*e1+g*m*sin(theta)**2*e2");
        // Fg
        assert.strictEqual(engine.renderAsString(engine.simplify(values[2]), { format: 'Infix' }), "-g*m*e2");
        // Fg / scaling
        assert.strictEqual(engine.renderAsString(engine.simplify(values[3]), { format: 'Infix' }), "-e2");
        // Fn / scaling
        assert.strictEqual(engine.renderAsString(values[4], { format: 'Infix' }), "-cos(theta)*sin(theta)*e1+cos(theta)**2.0*e2");
        // Fs / scaling
        assert.strictEqual(engine.renderAsString(values[5], { format: 'Infix' }), "cos(theta)*sin(theta)*e1+sin(theta)**2.0*e2");

        engine.release();
    });
});
