import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("derivative", function () {
    it("d(cos(x),x)", function () {
        const lines: string[] = [`derivative(cos(x),x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-sin(x)");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [`P=[x,y,z]`, `derivative(P,x)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,0,0]");
        engine.release();
    });
    it("f(x) depends on x", function () {
        const lines: string[] = [`derivative(f(x),x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "d(f(x),x)");
        engine.release();
    });
    it("f(x) does not depend on y", function () {
        const lines: string[] = [`derivative(f(x),y)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("f(x,y) depends on both x and y", function () {
        const lines: string[] = [`derivative(f(x,y),y)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        // FIXME: rendering is making assumption that it can use the shorthand.
        assert.strictEqual(engine.renderAsInfix(actual), "d(f(x,y),y)");
        engine.release();
    });
    xit("f() is a wildcard that matches any symbol", function () {
        const lines: string[] = [`derivative(f(),t)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        // Why are we only getting d(f,t)?
        assert.strictEqual(engine.renderAsInfix(actual), "derivative(f(),t)");
        engine.release();
    });
    it("derivative(exp(x),x)", function () {
        const lines: string[] = [`derivative(exp(x),x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "exp(x)");
        engine.release();
    });
});

describe("derivative", function () {
    it("derivative(a,b)", function () {
        const lines: string[] = [`derivative(a,b)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(f,x), when d is bound should be left alone", function () {
        const lines: string[] = [`d=foo`, `d(f,x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(d f x)");
        assert.strictEqual(engine.renderAsInfix(actual), "d(f,x)");

        engine.release();
    });
    it("derivative(a,x), when d is not bound should be transformed to derivative", function () {
        const lines: string[] = [`derivative(a,x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("derivative(a^x,x)", function () {
        const lines: string[] = [`derivative(a^x,x)-(x*derivative(a,x)/(a^(1-x))+a^x*log(a))`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("derivative(3^x,x)", function () {
        const lines: string[] = [`derivative(3^x,x)-3^x*log(3)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("derivative(a**x,x)", function () {
        const lines: string[] = [`derivative(a**x,x)-(x*derivative(a,x)/(a**(1-x))+a**x*log(a))`];
        const engine = create_script_context({ useCaretForExponentiation: false });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "0");

        engine.release();
    });
    it("derivative(x,x)", function () {
        const lines: string[] = [`derivative(x,x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("derivative(x**2,x)", function () {
        const lines: string[] = [`derivative(x**2,x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");

        engine.release();
    });
    it("derivative(x*x,x)", function () {
        const lines: string[] = [`derivative(x*x,x)`];
        const engine = create_script_context({
            useDerivativeShorthandLowerD: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        // assert.strictEqual(print_list(actual, $), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");
        engine.release();
    });
    it("derivative(sin(x),x)", function () {
        const lines: string[] = [`derivative(sin(x),x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)");
        engine.release();
    });
    it("derivative(cos(x),x)", function () {
        const lines: string[] = [`derivative(cos(x),x)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-sin(x)");
        engine.release();
    });
    it("derivative(1/(5+4*cos(x)),x)", function () {
        const lines: string[] = [`derivative(1/(5+4*cos(x)),x)-(4*sin(x)/(41+40*cos(x)-16*sin(x)**2))`];
        const engine = create_script_context({
            useDerivativeShorthandLowerD: true
        });
        const actual = engine.simplify(assert_one_value_execute(lines.join("\n"), engine));
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("gradient of f", function () {
        const lines: string[] = [`r = sqrt(x**2+y**2)`, `derivative(r,[x,y])`];
        const engine = create_script_context({
            useDerivativeShorthandLowerD: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[x/((x**2+y**2)**(1/2)),y/((x**2+y**2)**(1/2))]");
        engine.release();
    });
    it("gradient of F", function () {
        const lines: string[] = [`F = [x**2,y**2]`, `X=[x,y]`, `derivative(F,X)`];
        const engine = create_script_context({
            useDerivativeShorthandLowerD: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[2*x,0],[0,2*y]]");
        engine.release();
    });
    it("derivative of a derivative", function () {
        const lines: string[] = [`F = a * x * y`, `derivative(derivative(F,y),x)`];
        const engine = create_script_context({
            useDerivativeShorthandLowerD: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "a");
        engine.release();
    });
});
