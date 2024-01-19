
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, EngineConfig, ExprEngine, ParseConfig, RenderConfig } from "../src/api/index";

const engineConfig: Partial<EngineConfig> = {
    useGeometricAlgebra: true,
    useClojureScript: false
};
/*
const eigenmathConfig: EngineConfig = {
    useGeometricAlgebra: false
};
*/

function strip_whitespace(s: string): string {
    return s.replace(/\s/g, '');
}

const parseConfig: ParseConfig = {
    useGeometricAlgebra: false,
    useCaretForExponentiation: true,
    useParenForTensors: true
};

const renderConfig: RenderConfig = {
    format: 'Infix',
    useCaretForExponentiation: true,
    useParenForTensors: true
};

describe("coverage", function () {
    it("abs(x)", function () {
        const lines: string[] = [
            `X=(x,y,z)`,
            `abs(X)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(x^2 + y^2 + z^2)^(1/2)"));
        engine.release();
    });
    xit("adj(x)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `adj(A) == det(A) * inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    it("and(a,b,...)", function () {
        const lines: string[] = [
            `and(1=1,2=2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    it("arccos(x)", function () {
        const lines: string[] = [
            `arccos(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/3*pi"));
        engine.release();
    });
    it("arccosh(x)", function () {
        const lines: string[] = [
            `arccosh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("arccosh(1/2)"));
        engine.release();
    });
    it("arcsin(x)", function () {
        const lines: string[] = [
            `arcsin(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/6*pi"));
        engine.release();
    });
    it("arcsinh(x)", function () {
        const lines: string[] = [
            `arcsinh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("arcsinh(1/2)"));
        engine.release();
    });
    xit("arctan(y,x)", function () {
        const lines: string[] = [
            `arctan(1,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2*pi"));
        engine.release();
    });
    it("arctanh(x)", function () {
        const lines: string[] = [
            `arctanh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("arctanh(1/2)"));
        engine.release();
    });
    xit("arg(z)", function () {
        const lines: string[] = [
            `i = sqrt(-1)`,
            `arg(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-arctan(3,2)"));
        engine.release();
    });
    it("besselj(x,n)", function () {
        const lines: string[] = [
            `besselj(0,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    xit("bessely(x,n)", function () {
        const lines: string[] = [
            `bessely(0,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    xit("binding(s)", function () {
        const lines: string[] = [
            `p = quote((x + 1)^2)`,
            `binding(p)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(x + 1)^2"));
        engine.release();
    });
    it("ceiling(x)", function () {
        const lines: string[] = [
            `ceiling(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    xit("check(x)", function () {
        const lines: string[] = [
            `i = sqrt(-1)`,
            `A = exp(i * pi)`,
            `A`,
            `B = -1`,
            `B`,
            `check(A==B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("-1"));
        // assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("choose(n,k)", function () {
        const lines: string[] = [
            `choose(52,5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2598960"));
        engine.release();
    });
    it("circexp(x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `circexp(cos(x) + i * sin(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("exp(i*x)"));
        engine.release();
    });
    xit("clear", function () {
        const lines: string[] = [
            `clear`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    it("clearall", function () {
        const lines: string[] = [
            `clearall`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    xit("clock(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("13^(1/2)(-1)^(-1arctan(3,2)/pi)"));
        engine.release();
    });
    it("coeff(p,x,n)", function () {
        const lines: string[] = [
            `coeff(a*x^3+b*x^2+c*x+d,x,3)`,
            `coeff(a*x^3+b*x^2+c*x+d,x,2)`,
            `coeff(a*x^3+b*x^2+c*x+d,x,1)`,
            `coeff(a*x^3+b*x^2+c*x+d,x,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 4);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("a"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("b"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[2], renderConfig)), strip_whitespace("c"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[3], renderConfig)), strip_whitespace("d"));
        engine.release();
    });
    it("cofactor(m,i,j)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `cofactor(A,1,2) == adj(A)[2,1]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    it("conj(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `conj(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2 + 3 * i"));
        engine.release();
    });
    it("contract(a,i,j)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `contract(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("a+d"));
        engine.release();
    });
    xit("cos(x)", function () {
        const lines: string[] = [
            `cos(pi/4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2^(1/2)"));
        engine.release();
    });
    xit("cosh(x)", function () {
        const lines: string[] = [
            `circexp(cosh(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2*exp(-x)+1/2*exp(x)"));
        engine.release();
    });
    it("cross(u,v)", function () {
        const lines: string[] = [
            `cross(u,v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("cross(u,v)"));
        engine.release();
    });
    it("curl(v)", function () {
        const lines: string[] = [
            `curl(v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("curl(v)"));
        engine.release();
    });
    xit("d(f,x,...)", function () {
        const lines: string[] = [
            `d(sin(x),x)`,
            `d(sin(x),x,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("cos(x)"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-sin(x)"));
        engine.release();
    });
    xit("defint(f,x,a,b)", function () {
        const lines: string[] = [
            `f = (1 + cos(theta)^2) * sin(theta)`,
            `defint(f, theta, 0, pi, phi, 0, 2 * pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("cos(x)"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-sin(x)"));
        engine.release();
    });
    xit("deg(p,x)", function () {
        const lines: string[] = [
            `deg(a*x^2+b*x+c,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("b"));
        engine.release();
    });
    it("denominator(x)", function () {
        const lines: string[] = [
            `denominator(a/b)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("b"));
        engine.release();
    });
    it("det(m)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("a*d-b*c"));
        engine.release();
    });
    it("dim(a,m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4),(5,6))`,
            `dim(A,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("3"));
        engine.release();
    });
    it("div(v)", function () {
        const lines: string[] = [
            `div(v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("div(v)"));
        engine.release();
    });
    it("do(a,b,...)", function () {
        const lines: string[] = [
            `do(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("3"));
        engine.release();
    });
    it("dot(a,b,...)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `B=(5,6)`,
            `X=dot(inv(A),B)`,
            `X`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(-4,9/2)"));
        engine.release();
    });
    it("draw(f,x)", function () {
        const lines: string[] = [
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    xit("eigenval(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `eigenval(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("eigenvec(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `A=A+transpose(A)`,
            `Q=eigenvec(A)`,
            `D=dot(transpose(Q),A,Q)`,
            `dot(Q,D,tanspose(Q))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    it("eval(f,x,a,y,b,...)", function () {
        const lines: string[] = [
            `f=sqrt(x^2 + y^2)`,
            `eval(f,x,3,y,4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("5"));
        engine.release();
    });
    xit("erf(x)", function () {
        const lines: string[] = [
            `erf(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("erfc(x)", function () {
        const lines: string[] = [
            `erfc(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    it("exp(x)", function () {
        const lines: string[] = [
            `Pi=tau(1/2)`,
            `i=sqrt(-1)`,
            `exp(i * Pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-1"));
        engine.release();
    });
    it("expand(r,x)", function () {
        const lines: string[] = [
            `expand(r,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("r"));
        engine.release();
    });
    it("expcos(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expcos(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2*exp(-i*z)+1/2*exp(i*z)"));
        engine.release();
    });
    xit("expcosh(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expcosh(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2*exp(-z)+1/2*exp(z)"));
        engine.release();
    });
    it("expsin(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expsin(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2*i*exp(-i*z)-1/2*i*exp(i*z)"));
        engine.release();
    });
    xit("expsinh(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expsinh(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2*exp(-z)+1/2*exp(z)"));
        engine.release();
    });
    xit("exptan(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exptan(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("exptanh(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exptanh(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    it("factor(n)", function () {
        const lines: string[] = [
            `factor(100!)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2^97*3^48*5^24*7^16*11^9*13^7*17^5*19^5*23^4*29^3*31^3*37^2*41^2*43^2*47^2*53*59*61*67*71*73*79*83*89*97"));
        engine.release();
    });
    it("factorial(n)", function () {
        const lines: string[] = [
            `factorial(20)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2432902008176640000"));
        engine.release();
    });
    it("float(x)", function () {
        const lines: string[] = [
            `float(212^17)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("3.5294711457602754e+39"));
        engine.release();
    });
    it("floor(x)", function () {
        const lines: string[] = [
            `floor(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("0"));
        engine.release();
    });
    xit("for(i,j,k,a,b,...)", function () {
        const lines: string[] = [
            `for(k,1,3,A=k,print(A))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("0"));
        engine.release();
    });
    it("gcd(a,b,...)", function () {
        const lines: string[] = [
            `gcd(30,42)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("6"));
        engine.release();
    });
    xit("grad(f)", function () {
        const lines: string[] = [
            `grad(f())`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(d(f(),x),d(f(),y),d(f(),z))"));
        engine.release();
    });
    xit("hadamard(a,b,...)", function () {
        const lines: string[] = [
            `A=((a11,a12),(a21,a22))`,
            `B=((b11,b12),(b21,b22))`,
            `hadamard(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    it("hermite(x,n)", function () {
        const lines: string[] = [
            `hermite(x,0)`,
            `hermite(x,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("2*x"));
        engine.release();
    });
    xit("hilbert(n)", function () {
        const lines: string[] = [
            `hilbert(0)`,
            `hilbert(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("2*x"));
        engine.release();
    });
    it("i", function () {
        const lines: string[] = [
            `Pi=tau(1/2)`,
            `i=sqrt(-1)`,
            `exp(i* Pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-1"));
        engine.release();
    });
    xit("imag(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-3"));
        engine.release();
    });
    xit("infixform(x)", function () {
        const lines: string[] = [
            `p=(x+1)^2`,
            `iinfixform(p)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    it("inner(a,b,...)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `B=(x,y)`,
            `inner(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(a*x+b*y,c*x+d*y)"));
        engine.release();
    });
    it("integral(f,x)", function () {
        const lines: string[] = [
            `integral(x^2,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/3*x^3"));
        engine.release();
    });
    it("inv(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("((-2,1),(3/2,-1/2))"));
        engine.release();
    });
    it("isprime(n)", function () {
        const lines: string[] = [
            `isprime(0)`,
            `isprime(1)`,
            `isprime(2)`,
            `isprime(3)`,
            `isprime(4)`,
            `isprime(5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 6);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("0"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("0"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[2], renderConfig)), strip_whitespace("1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[3], renderConfig)), strip_whitespace("1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[4], renderConfig)), strip_whitespace("0"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[5], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    it("j", function () {
        const lines: string[] = [
            `j=sqrt(-1)`,
            `1/sqrt(-1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-j"));
        engine.release();
    });
    xit("kronecker(a,b,...)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `B=((a,b),(c,d))`,
            `kronecker(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("((a,b,2a,2b),(c,d,2c,2d),(3a,3b,4a,4b),(3c,3d,4c,4d))"));
        engine.release();
    });
    it("laguerre(x,n,a)", function () {
        const lines: string[] = [
            `laguerre(x,0)`,
            `laguerre(x,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("1-x"));
        engine.release();
    });
    it("lcm(a,b,...)", function () {
        const lines: string[] = [
            `lcm(4,6)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("12"));
        engine.release();
    });
    xit("last", function () {
        const lines: string[] = [
            `212^17`,
            `last^(1/17)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("212"));
        engine.release();
    });
    it("leading(p,x)", function () {
        const lines: string[] = [
            `leading(5*x^2+x+1,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("5"));
        engine.release();
    });
    it("legendre(x,n,m)", function () {
        const lines: string[] = [
            `legendre(x,0)`,
            `legendre(x,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("x"));
        engine.release();
    });
    it("log(x)", function () {
        const lines: string[] = [
            `log(x^y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("y * log(x)"));
        engine.release();
    });
    xit("lookup(x)", function () {
        const lines: string[] = [
            `x=quote(1+2)`,
            `lookup(x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1 + 2"));
        engine.release();
    });
    xit("mag(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `mag(x + i * y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(x^2 + y^2)^(1/2)"));
        engine.release();
    });
    xit("minor(m,i,j)", function () {
        const lines: string[] = [
            `A=((1,2,3),(4,5,6),(7,8,9))`,
            `minor(A,1,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-3"));
        engine.release();
    });
    xit("minormatrix(m,i,j)", function () {
        const lines: string[] = [
            `A=((1,2,3),(4,5,6),(7,8,9))`,
            `minormatrix(A,1,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("((5,6),(8,9))"));
        engine.release();
    });
    xit("mod(a,b)", function () {
        const lines: string[] = [
            `mod(5,3/8)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/8"));
        engine.release();
    });
    xit("noexpand(x)", function () {
        const lines: string[] = [
            `noexpand((x+1)^2/(x+1))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("x + 1"));
        engine.release();
    });
    it("not(x)", function () {
        const lines: string[] = [
            `not(1=1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("0"));
        engine.release();
    });
    xit("nroots(p,x)", function () {
        const lines: string[] = [
            `p=x^5 - 1`,
            `nroots(p,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(1.000000...,-0.809017...+0.587785...*i,-0.809017...-0.587785...*i,0.309017...+0.951057...*i,0.309017...-0.951057...*i)"));
        engine.release();
    });
    it("numerator(x)", function () {
        const lines: string[] = [
            `numerator(a/b)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("a"));
        engine.release();
    });
    it("or(a,b,...)", function () {
        const lines: string[] = [
            `or(1=1,2=2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    it("outer(a,b,...)", function () {
        const lines: string[] = [
            `A=(a,b,c)`,
            `B=(x,y,z)`,
            `outer(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("((a*x,a*y,a*z),(b*x,b*y,b*z),(c*x,c*y,c*z))"));
        engine.release();
    });
    it("pi", function () {
        const lines: string[] = [
            `Pi=tau(1/2)`,
            `i=sqrt(-1)`,
            `exp(i * Pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-1"));
        engine.release();
    });
    xit("polar(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `polar(x - i * y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(x^2+y^2)^(1/2)*exp(i*arctan(-y,x))"));
        engine.release();
    });
    xit("power", function () {
        const lines: string[] = [
            `x^(-1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/x^(1/2)"));
        engine.release();
    });
    it("prime(n)", function () {
        const lines: string[] = [
            `prime(1)`,
            `prime(2)`,
            `prime(3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 3);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[1], renderConfig)), strip_whitespace("3"));
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[2], renderConfig)), strip_whitespace("5"));
        engine.release();
    });
    xit("print(a,b,...)", function () {
        const lines: string[] = [
            `print(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("print2dascii(a,b,...)", function () {
        const lines: string[] = [
            `print2dascii(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("printcomputer(a,b,...)", function () {
        const lines: string[] = [
            `printcomputer(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("printlatex(a,b,...)", function () {
        const lines: string[] = [
            `printlatex(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("printlist(a,b,...)", function () {
        const lines: string[] = [
            `printlist(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("printhuman(a,b,...)", function () {
        const lines: string[] = [
            `printhuman(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    xit("product(i,j,k,f)", function () {
        const lines: string[] = [
            `product(j,1,3,x + j)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("x^3+6*x^2+11*x+6"));
        engine.release();
    });
    xit("product(y)", function () {
        const lines: string[] = [
            `y=(1,2,3,4)`,
            `product(y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("24"));
        engine.release();
    });
    it("quote(x)", function () {
        const lines: string[] = [
            `quote((x + 1)^2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(x + 1)^2"));
        engine.release();
    });
    it("quotient(p,q,x)", function () {
        const lines: string[] = [
            `quotient(x^2+1,x+1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("-1+x"));
        engine.release();
    });
    it("rank(a)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `rank(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2"));
        engine.release();
    });
    it("rationalize(x)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b+1/c)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(a*b+a*c+b*c)/(a*b*c)"));
        engine.release();
    });
    xit("real(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("2"));
        engine.release();
    });
    it("rect(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `rect(exp(i*x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("cos(x) + i * sin(x)"));
        engine.release();
    });
    it("roots(p,x)", function () {
        const lines: string[] = [
            `p=(x+1)*(x-2)`,
            `roots(p,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(-1,2)"));
        engine.release();
    });
    xit("rotate(u,s,k,...)", function () {
        const lines: string[] = [
            `psi=(1,0,0,0)`,
            `rotate(psi,H,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("()"));
        engine.release();
    });
    xit("run(x)", function () {
        const lines: string[] = [
            `run("foo.txt")`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("()"));
        engine.release();
    });
    it("shape(x)", function () {
        const lines: string[] = [
            `shape((a,b,c))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("(3)"));
        engine.release();
    });
    it("simplify(x)", function () {
        const lines: string[] = [
            `simplify(cos(x)^2+sin(x)^2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    xit("sin(x)", function () {
        const lines: string[] = [
            `sin(pi/4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1/2^(1/2)"));
        engine.release();
    });
    xit("sinh(x)", function () {
        const lines: string[] = [
            `sinh(x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(""));
        engine.release();
    });
    it("sqrt(x)", function () {
        const lines: string[] = [
            `sqrt(factorial(10))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("720*7^(1/2)"));
        engine.release();
    });
    xit("stop", function () {
        const lines: string[] = [
            `stop`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            try {
                engine.evaluate(tree);
                assert.fail();
            }
            catch (e) {
                assert.strictEqual(`${e}`, "Error: stop");
            }
        }
        engine.release();
    });
    it("subst(a,b,c)", function () {
        const lines: string[] = [
            `subst(a,b,c)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("c"));
        engine.release();
    });
    xit("sum(i,j,k,f)", function () {
        const lines: string[] = [
            `sum(j,1,5,x^j)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("x^5+x^4+x^3+x^2+x"));
        engine.release();
    });
    it("tan(x)", function () {
        const lines: string[] = [
            `Pi=tau(1/2)`,
            `tan(Pi/4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("1"));
        engine.release();
    });
    it("tanh(x)", function () {
        const lines: string[] = [
            `circexp(tanh(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("exp(2*x)/(1+exp(2*x))-1/(1+exp(2*x))"));
        engine.release();
    });
    xit("taylor(f,x,n,a)", function () {
        const lines: string[] = [
            `taylor(1/(1-x),x,5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("x^5+x^4+x^3+x^2+x+1"));
        engine.release();
    });
    it("test(a,b,c,d,...)", function () {
        const lines: string[] = [
            `A=1`,
            `B=1`,
            `test(A=B, "yes", "no")`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(`"yes"`));
        engine.release();
    });
    it("trace", function () {
        const lines: string[] = [
            `trace=1`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    it("transpose(a,i,j)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `transpose(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(`((a,c),(b,d))`));
        engine.release();
    });
    it("tty", function () {
        const lines: string[] = [
            `tty=1`,
            `(x+1)^2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(`1+2*x+x^2`));
        engine.release();
    });
    it("unit(n)", function () {
        const lines: string[] = [
            `unit(3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(`((1,0,0),(0,1,0),(0,0,1))`));
        engine.release();
    });
    xit("zero(i,j,...)", function () {
        const lines: string[] = [
            `A=zero(3,3)`,
            `for(k,1,3,A[k,k]=k)`,
            `A`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.evaluate(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(`((1,0,0),(0,1,0),(0,0,1))`));
        engine.release();
    });
});