import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("derivative-sandbox", function () {
    it("d(cos(x),x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(cos(x),x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-sin(x)");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(a+b,x)", function () {
        const lines: string[] = [
            `d(a+b,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ (derivative a x) (derivative b x))");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,x)+d(b,x)");
        engine.release();
    });
    it("d(b+a,x)", function () {
        const lines: string[] = [
            `d(b+a,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ (derivative a x) (derivative b x))");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,x)+d(b,x)");
        engine.release();
    });
    it("d(b,x)+d(a,x)", function () {
        const lines: string[] = [
            `d(b,x)+d(a,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ (derivative a x) (derivative b x))");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,x)+d(b,x)");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(a,b)", function () {
        const lines: string[] = [
            `d(a,b)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(derivative a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,b)");
        engine.release();
    });
});

describe("derivative", function () {
    it("d(f,x), when d is bound should be left alone", function () {
        const lines: string[] = [
            `d=foo`,
            `d(f,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(d f x)");
        assert.strictEqual(engine.renderAsInfix(actual), "d(f,x)");

        engine.release();
    });
    it("d(a,x), when d is not bound should be transformed to derivative", function () {
        const lines: string[] = [
            `d(a,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(derivative a x)");
        assert.strictEqual(engine.renderAsInfix(actual), "d(a,x)");

        engine.release();
    });
    it("d(x,x)", function () {
        const lines: string[] = [
            `d(x,x)`
        ];
        const engine = createScriptEngine();
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
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");

        engine.release();
    });
    it("d(x*x,x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(x*x,x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual, $), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");
        engine.release();
    });
    it("d(sin(x),x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(sin(x),x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)");
        engine.release();
    });
    it("d(cos(x),x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `d(cos(x),x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-sin(x)");
        engine.release();
    });
    it("d(1/(5+4*cos(x)),x)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=1`,
            `d(1/(5+4*cos(x)),x)`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "(* (* (* 4 (power (+ 5 (* 4 (cos x))) -1)) (sin x)) (power (+ 5 (* 4 (cos x))) -1))");
        // TODO: The denominator should contain a squared term expressed using power.
        assert.strictEqual(engine.renderAsInfix(actual), "4*sin(x)/((5+4*cos(x))*(5+4*cos(x)))");
        engine.release();
    });
});

describe("derivative", function () {
    it("a*d(b,x)+a*d(b,y)", function () {
        const lines: string[] = [
            `a*d(b,x)+a*d(b,y)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a (+ (derivative b x) (derivative b y)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,x)+d(b,y))");
        engine.release();
    });
    it("a*(d(b,x)+d(b,y))", function () {
        const lines: string[] = [
            `a*(d(b,x)+d(b,y))`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a (+ (derivative b x) (derivative b y)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,x)+d(b,y))");
        engine.release();
    });
    it("d(b,y)+d(b,x)", function () {
        const lines: string[] = [
            `d(b,y)+d(b,x)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (derivative b x) (derivative b y))");
        assert.strictEqual(engine.renderAsInfix(value), "d(b,x)+d(b,y)");
        engine.release();
    });
    it("a*(d(b,y)+d(b,x))", function () {
        const lines: string[] = [
            `a*(d(b,y)+d(b,x))`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a (+ (derivative b x) (derivative b y)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,x)+d(b,y))");
        engine.release();
    });
});
