import { assert } from "chai";
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("derivative-sandbox", function () {
    it("d(cos(x),x)", function () {
        const lines: string[] = [
            `d(cos(x),x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-sin(x)");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [
            `P=[x,y,z]`,
            `d(P,x)`,
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,0,0]");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(exp(x),x)", function () {
        const lines: string[] = [
            `d(exp(x),x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsInfix(actual), "e**x");
        assert.strictEqual(engine.renderAsInfix(actual), "exp(x)");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(a,b)", function () {
        const lines: string[] = [
            `d(a,b)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(f,x), when d is bound should be left alone", function () {
        const lines: string[] = [
            `d=foo`,
            `d(f,x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(d f x)");
        assert.strictEqual(engine.renderAsInfix(actual), "d(f,x)");

        engine.release();
    });
    it("d(a,x), when d is not bound should be transformed to derivative", function () {
        const lines: string[] = [
            `d(a,x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("d(a^x,x)", function () {
        const lines: string[] = [
            `d(a^x,x)-(x*d(a,x)/(a^(1-x))+a^x*log(a))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("d(3^x,x)", function () {
        const lines: string[] = [
            `d(3^x,x)-3^x*log(3)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("d(a**x,x)", function () {
        const lines: string[] = [
            `d(a**x,x)-(x*d(a,x)/(a**(1-x))+a**x*log(a))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: false });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("d(x,x)", function () {
        const lines: string[] = [
            `d(x,x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("d(x**2,x)", function () {
        // Looping
        const lines: string[] = [
            `d(x**2,x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");

        engine.release();
    });
    it("d(x*x,x)", function () {
        const lines: string[] = [
            `d(x*x,x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual, $), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");
        engine.release();
    });
    it("d(sin(x),x)", function () {
        const lines: string[] = [
            `d(sin(x),x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)");
        engine.release();
    });
    it("d(cos(x),x)", function () {
        const lines: string[] = [
            `d(cos(x),x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-sin(x)");
        engine.release();
    });
    it("d(1/(5+4*cos(x)),x)", function () {
        const lines: string[] = [
            `d(1/(5+4*cos(x)),x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "4*sin(x)/((5+4*cos(x))**2)");
        engine.release();
    });
});
