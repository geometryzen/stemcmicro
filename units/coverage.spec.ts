
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, EngineConfig, ExprEngine, ParseConfig, RenderConfig } from "../src/api/index";

const nativeConfig: EngineConfig = {
    useGeometricAlgebra: true
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eigenmathConfig: EngineConfig = {
    useGeometricAlgebra: false
};

function stripWhitespace(s: string): string {
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
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x^2 + y^2 + z^2)^(1/2)"));
        engine.release();
    });
    xit("adj(x)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `adj(A) == det(A) * inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("and(a,b,...)", function () {
        const lines: string[] = [
            `and(1=1,2=2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("arccos(x)", function () {
        const lines: string[] = [
            `arccos(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/3*pi"));
        engine.release();
    });
    it("arccosh(x)", function () {
        const lines: string[] = [
            `arccosh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("arccosh(1/2)"));
        engine.release();
    });
    it("arcsin(x)", function () {
        const lines: string[] = [
            `arcsin(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/6*pi"));
        engine.release();
    });
    it("arcsinh(x)", function () {
        const lines: string[] = [
            `arcsinh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("arcsinh(1/2)"));
        engine.release();
    });
    xit("arctan(y,x)", function () {
        const lines: string[] = [
            `arctan(1,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2*pi"));
        engine.release();
    });
    it("arctanh(x)", function () {
        const lines: string[] = [
            `arctanh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("arctanh(1/2)"));
        engine.release();
    });
    xit("arg(z)", function () {
        const lines: string[] = [
            `i = sqrt(-1)`,
            `arg(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-arctan(3,2)"));
        engine.release();
    });
    xit("binding(s)", function () {
        const lines: string[] = [
            `p = quote((x + 1)^2)`,
            `binding(p)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x + 1)^2"));
        engine.release();
    });
    it("ceiling(x)", function () {
        const lines: string[] = [
            `ceiling(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
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
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("-1"));
        // assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("choose(n,k)", function () {
        const lines: string[] = [
            `choose(52,5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2598960"));
        engine.release();
    });
    it("circexp(x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `circexp(cos(x) + i * sin(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("exp(i*x)"));
        engine.release();
    });
    xit("clear", function () {
        const lines: string[] = [
            `clear`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("13^(1/2)(-1)^(-1arctan(3,2)/pi)"));
        engine.release();
    });
    it("cofactor(m,i,j)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `cofactor(A,1,2) == adj(A)[2,1]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("conj(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `conj(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2 + 3 * i"));
        engine.release();
    });
    it("contract(a,i,j)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `contract(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a+d"));
        engine.release();
    });
    xit("cos(x)", function () {
        const lines: string[] = [
            `cos(pi/4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2^(1/2)"));
        engine.release();
    });
    xit("cosh(x)", function () {
        const lines: string[] = [
            `circexp(cosh(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2*exp(-x)+1/2*exp(x)"));
        engine.release();
    });
    it("cross(u,v)", function () {
        const lines: string[] = [
            `cross(u,v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("cross(u,v)"));
        engine.release();
    });
    it("curl(v)", function () {
        const lines: string[] = [
            `curl(v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("curl(v)"));
        engine.release();
    });
    xit("d(f,x,...)", function () {
        const lines: string[] = [
            `d(sin(x),x)`,
            `d(sin(x),x,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("cos(x)"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-sin(x)"));
        engine.release();
    });
    xit("defint(f,x,a,b)", function () {
        const lines: string[] = [
            `f = (1 + cos(theta)^2) * sin(theta)`,
            `defint(f, theta, 0, pi, phi, 0, 2 * pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("cos(x)"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-sin(x)"));
        engine.release();
    });
    it("denominator(x)", function () {
        const lines: string[] = [
            `denominator(a/b)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("b"));
        engine.release();
    });
    it("det(m)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a*d-b*c"));
        engine.release();
    });
    it("dim(a,m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4),(5,6))`,
            `dim(A,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("3"));
        engine.release();
    });
    it("div(v)", function () {
        const lines: string[] = [
            `div(v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("div(v)"));
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
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(-4,9/2)"));
        engine.release();
    });
    it("draw(f,x)", function () {
        const lines: string[] = [
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
    xit("eigenvec(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `A=A+transpose(A)`,
            `Q=eigenvec(A)`,
            `D=dot(transpose(Q),A,Q)`,
            `dot(Q,D,tanspose(Q))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(""));
        engine.release();
    });
    it("eval(f,x,a,y,b,...)", function () {
        const lines: string[] = [
            `f=sqrt(x^2 + y^2)`,
            `eval(f,x,3,y,4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("5"));
        engine.release();
    });
    it("exp(x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exp(i * pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-1"));
        engine.release();
    });
    it("expcos(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expcos(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2*exp(-i*z)+1/2*exp(i*z)"));
        engine.release();
    });
    xit("expcosh(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expcosh(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2*exp(-z)+1/2*exp(z)"));
        engine.release();
    });
    it("expsin(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expsin(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2*i*exp(-i*z)-1/2*i*exp(i*z)"));
        engine.release();
    });
    xit("expsinh(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expsinh(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2*exp(-z)+1/2*exp(z)"));
        engine.release();
    });
    xit("exptan(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exptan(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(""));
        engine.release();
    });
    xit("exptanh(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exptanh(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(""));
        engine.release();
    });
    it("factorial(n)", function () {
        const lines: string[] = [
            `factorial(20)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2432902008176640000"));
        engine.release();
    });
    it("float(x)", function () {
        const lines: string[] = [
            `float(212^17)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("3.5294711457602754e+39"));
        engine.release();
    });
    it("floor(x)", function () {
        const lines: string[] = [
            `floor(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        engine.release();
    });
    xit("for(i,j,k,a,b,...)", function () {
        const lines: string[] = [
            `for(k,1,3,A=k,print(A))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        engine.release();
    });
    xit("grad(f)", function () {
        const lines: string[] = [
            `grad(f())`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(d(f(),x),d(f(),y),d(f(),z))"));
        engine.release();
    });
    xit("hadamard(a,b,...)", function () {
        const lines: string[] = [
            `A=((a11,a12),(a21,a22))`,
            `B=((b11,b12),(b21,b22))`,
            `hadamard(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(""));
        engine.release();
    });
    it("i", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exp(i* pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-1"));
        engine.release();
    });
    xit("imag(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-3"));
        engine.release();
    });
    xit("infixform(x)", function () {
        const lines: string[] = [
            `p=(x+1)^2`,
            `iinfixform(p)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(""));
        engine.release();
    });
    it("inner(a,b,...)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `B=(x,y)`,
            `inner(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(a*x+b*y,c*x+d*y)"));
        engine.release();
    });
    it("integral(f,x)", function () {
        const lines: string[] = [
            `integral(x^2,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/3*x^3"));
        engine.release();
    });
    it("inv(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("((-2,1),(3/2,-1/2))"));
        engine.release();
    });
    it("j", function () {
        const lines: string[] = [
            `j=sqrt(-1)`,
            `1/sqrt(-1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-j"));
        engine.release();
    });
    xit("kronecker(a,b,...)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `B=((a,b),(c,d))`,
            `kronecker(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("((a,b,2a,2b),(c,d,2c,2d),(3a,3b,4a,4b),(3c,3d,4c,4d))"));
        engine.release();
    });
    xit("last", function () {
        const lines: string[] = [
            `212^17`,
            `last^(1/17)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("212"));
        engine.release();
    });
    it("log(x)", function () {
        const lines: string[] = [
            `log(x^y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("y * log(x)"));
        engine.release();
    });
    xit("mag(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `mag(x + i * y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x^2 + y^2)^(1/2)"));
        engine.release();
    });
    xit("minor(m,i,j)", function () {
        const lines: string[] = [
            `A=((1,2,3),(4,5,6),(7,8,9))`,
            `minor(A,1,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-3"));
        engine.release();
    });
    xit("minormatrix(m,i,j)", function () {
        const lines: string[] = [
            `A=((1,2,3),(4,5,6),(7,8,9))`,
            `minormatrix(A,1,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("((5,6),(8,9))"));
        engine.release();
    });
    xit("mod(a,b)", function () {
        const lines: string[] = [
            `mod(5,3/8)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/8"));
        engine.release();
    });
    xit("noexpand(x)", function () {
        const lines: string[] = [
            `noexpand((x+1)^2/(x+1))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("x + 1"));
        engine.release();
    });
    it("not(x)", function () {
        const lines: string[] = [
            `not(1=1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        engine.release();
    });
    xit("nroots(p,x)", function () {
        const lines: string[] = [
            `p=x^5 - 1`,
            `nroots(p,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(1.000000...,-0.809017...+0.587785...*i,-0.809017...-0.587785...*i,0.309017...+0.951057...*i,0.309017...-0.951057...*i)"));
        engine.release();
    });
    it("numerator(x)", function () {
        const lines: string[] = [
            `numerator(a/b)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a"));
        engine.release();
    });
    it("or(a,b,...)", function () {
        const lines: string[] = [
            `or(1=1,2=2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("outer(a,b,...)", function () {
        const lines: string[] = [
            `A=(a,b,c)`,
            `B=(x,y,z)`,
            `outer(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("((a*x,a*y,a*z),(b*x,b*y,b*z),(c*x,c*y,c*z))"));
        engine.release();
    });
    it("pi", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `exp(i * pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-1"));
        engine.release();
    });
    xit("polar(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `polar(x - i * y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x^2+y^2)^(1/2)*exp(i*arctan(-y,x))"));
        engine.release();
    });
    xit("power", function () {
        const lines: string[] = [
            `x^(-1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/x^(1/2)"));
        engine.release();
    });
    xit("product(i,j,k,f)", function () {
        const lines: string[] = [
            `product(j,1,3,x + j)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("x^3+6*x^2+11*x+6"));
        engine.release();
    });
    xit("product(y)", function () {
        const lines: string[] = [
            `y=(1,2,3,4)`,
            `product(y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("24"));
        engine.release();
    });
    it("quote(x)", function () {
        const lines: string[] = [
            `quote((x + 1)^2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x + 1)^2"));
        engine.release();
    });
    it("rank(a)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `rank(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2"));
        engine.release();
    });
    it("rationalize(x)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b+1/c)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(a*b+a*c+b*c)/(a*b*c)"));
        engine.release();
    });
    xit("real(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2"));
        engine.release();
    });
    it("rect(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `rect(exp(i*x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("cos(x) + i * sin(x)"));
        engine.release();
    });
    it("roots(p,x)", function () {
        const lines: string[] = [
            `p=(x+1)*(x-2)`,
            `roots(p,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(-1,2)"));
        engine.release();
    });
    xit("rotate(u,s,k,...)", function () {
        const lines: string[] = [
            `psi=(1,0,0,0)`,
            `rotate(psi,H,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("()"));
        engine.release();
    });
    xit("run(x)", function () {
        const lines: string[] = [
            `run("foo.txt")`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("()"));
        engine.release();
    });
    it("simplify(x)", function () {
        const lines: string[] = [
            `simplify(cos(x)^2+sin(x)^2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    xit("sin(x)", function () {
        const lines: string[] = [
            `sin(pi/4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/2^(1/2)"));
        engine.release();
    });
    xit("sinh(x)", function () {
        const lines: string[] = [
            `sinh(x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(""));
        engine.release();
    });
    it("sqrt(x)", function () {
        const lines: string[] = [
            `sqrt(factorial(10))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("720*7^(1/2)"));
        engine.release();
    });
    xit("stop", function () {
        const lines: string[] = [
            `stop`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
    xit("sum(i,j,k,f)", function () {
        const lines: string[] = [
            `sum(j,1,5,x^j)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(nativeConfig);
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
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("x^5+x^4+x^3+x^2+x"));
        engine.release();
    });
});