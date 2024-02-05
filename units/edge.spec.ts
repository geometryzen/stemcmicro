
import { assert } from "chai";
import { Cons, is_nil, U } from "math-expression-tree";
import { create_engine, EngineConfig, ExprEngine, ParseConfig, RenderConfig, UndeclaredVars } from "../src/api/api";
import { Stepper } from "../src/clojurescript/runtime/Stepper";
import { SyntaxKind } from "../src/parser/parser";

const engineOptions: Partial<EngineConfig> = {
    allowUndeclaredVars: UndeclaredVars.Nil,
    syntaxKind: SyntaxKind.STEMCscript
};

function stripWhitespace(s: string): string {
    return s.replace(/\s/g, '');
}

const parseConfig: ParseConfig = {
    useCaretForExponentiation: false,
    useParenForTensors: false
};

const renderConfig: RenderConfig = {
    format: 'Infix',
    useCaretForExponentiation: false,
    useParenForTensors: false
};

/**
 * Uses the Stepper to evaluate a module.
 * @param module The module created by parsing a script as a module. 
 * @returns The non-nil values returned by the module.
 */
function stepModule(module: Cons): U[] {
    const values: U[] = [];
    const runner = new Stepper(module);
    let steps = 0;
    while (runner.next()) {
        steps++;
    }
    steps;
    const stack = runner.stack;
    for (const value of stack.top.values) {
        if (!is_nil(value)) {
            values.push(value);
        }
    }
    return values;
}

/**
 * The cutting edge.
 * 
 * A test of coverage of the entire suite of functions.
 */
describe("edge", function () {
    it("+", function () {
        const lines: string[] = [
            `1+2+3+4+5`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("15"));
        engine.release();
    });
    it("*", function () {
        const lines: string[] = [
            `1*2*3*4*5`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("120"));
        engine.release();
    });
    it("^", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `e1^e1`,
            `e1^e2`,
            `e1^e3`,
            `e2^e1`,
            `e2^e2`,
            `e2^e3`,
            `e3^e1`,
            `e3^e2`,
            `e3^e3`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 9);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("e1^e2"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("e1^e3"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("-e1^e2"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[4], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[5], renderConfig)), stripWhitespace("e2^e3"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[6], renderConfig)), stripWhitespace("-e1^e3"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[7], renderConfig)), stripWhitespace("-e2^e3"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[8], renderConfig)), stripWhitespace("0"));
        engine.release();
    });
    it("|", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `e1|e1`,
            `e1|e2`,
            `e1|e3`,
            `e2|e1`,
            `e2|e2`,
            `e2|e3`,
            `e3|e1`,
            `e3|e2`,
            `e3|e3`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 9);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[4], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[5], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[6], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[7], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[8], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("<<", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `e1<<e1`,
            `e1<<e2`,
            `e1<<e3`,
            `e2<<e1`,
            `e2<<e2`,
            `e2<<e3`,
            `e3<<e1`,
            `e3<<e2`,
            `e3<<e3`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 9);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[4], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[5], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[6], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[7], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[8], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it(">>", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `e1>>e1`,
            `e1>>e2`,
            `e1>>e3`,
            `e2>>e1`,
            `e2>>e2`,
            `e2>>e3`,
            `e3>>e1`,
            `e3>>e2`,
            `e3>>e3`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 9);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[4], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[5], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[6], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[7], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[8], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("=", function () {
        const lines: string[] = [
            `x=24`,
            `x`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("24"));
        engine.release();
    });
    it("==", function () {
        const lines: string[] = [
            `0==0`,
            `0==1`,
            `1==0`,
            `1==1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`0`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`0`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`1`));
        engine.release();
    });
    it("!=", function () {
        const lines: string[] = [
            `0!=0`,
            `0!=1`,
            `1!=0`,
            `1!=1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`0`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`0`));
        engine.release();
    });
    it(">", function () {
        const lines: string[] = [
            `0>0`,
            `0>1`,
            `1>0`,
            `1>1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`false`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`false`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`true`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`false`));
        engine.release();
    });
    it(">=", function () {
        const lines: string[] = [
            `0>=0`,
            `0>=1`,
            `1>=0`,
            `1>=1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`0`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`1`));
        engine.release();
    });
    it("<", function () {
        const lines: string[] = [
            `0<0`,
            `0<1`,
            `1<0`,
            `1<1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`false`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`true`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`false`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`false`));
        engine.release();
    });
    it("<=", function () {
        const lines: string[] = [
            `0<=0`,
            `0<=1`,
            `1<=0`,
            `1<=1`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`1`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`0`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`1`));
        engine.release();
    });
    it("A[i,j,...]=", function () {
        const lines: string[] = [
            `A=unit(2)`,
            `A[1,1]=a`,
            `A[1,2]=b`,
            `A[2,1]=c`,
            `A[2,2]=d`,
            `A`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[[a,b],[c,d]]"));
        engine.release();
    });
    it("abs(x)", function () {
        const lines: string[] = [
            `abs([x,y,z])`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x**2 + y**2 + z**2)**(1/2)"));
        engine.release();
    });
    xit("adj(x)", function () {
        const lines: string[] = [
            `A=((a,b),(c,d))`,
            `adj(A) == det(A) * inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("algebra(metric,labels)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `G30`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[e1,e2,e3]"));
        engine.release();
    });
    it("and(a,b,...)", function () {
        const lines: string[] = [
            `and(0,0)`,
            `and(0,1)`,
            `and(1,0)`,
            `and(1,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("arccos(x)", function () {
        const lines: string[] = [
            `arccos(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/3*pi"));
        engine.release();
    });
    it("arccosh(x)", function () {
        const lines: string[] = [
            `arccosh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("arccosh(1/2)"));
        engine.release();
    });
    it("arcsin(x)", function () {
        const lines: string[] = [
            `arcsin(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/6*pi"));
        engine.release();
    });
    it("arcsinh(x)", function () {
        const lines: string[] = [
            `arcsinh(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("arcsinh(1/2)"));
        engine.release();
    });
    xit("arctan(y,x)", function () {
        const lines: string[] = [
            `arctan(1,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("arctanh(1/2)"));
        engine.release();
    });
    it("arg(z)", function () {
        const lines: string[] = [
            `i = sqrt(-1)`,
            `arg(1)`,
            `arg(i)`,
            `arg(-1)`,
            `arg(-i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("1/2*pi"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("pi"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("-1/2*pi"));
        engine.release();
    });
    it("besselj(x,n)", function () {
        const lines: string[] = [
            `besselj(0,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    xit("bessely(x,n)", function () {
        const lines: string[] = [
            `bessely(0,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    xit("binding(s)", function () {
        const lines: string[] = [
            `p = quote((x + 1)^2)`,
            `binding(p)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("exp(i*x)"));
        engine.release();
    });
    xit("clear", function () {
        const lines: string[] = [
            `clear`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("clearall", function () {
        const lines: string[] = [
            `clearall`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    xit("clock(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock(2 - 3 * i)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("coeff(p,x,n)", function () {
        const lines: string[] = [
            `coeff(a*x**3+b*x**2+c*x+d,x,3)`,
            `coeff(a*x**3+b*x**2+c*x+d,x,2)`,
            `coeff(a*x**3+b*x**2+c*x+d,x,1)`,
            `coeff(a*x**3+b*x**2+c*x+d,x,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("b"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("c"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("d"));
        engine.release();
    });
    it("cofactor(m,i,j)", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `cofactor(A,1,2) == adj(A)[2,1]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2 + 3 * i"));
        engine.release();
    });
    it("contract(a,i,j)", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `contract(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a+d"));
        engine.release();
    });
    it("cos(x)", function () {
        const lines: string[] = [
            `cos(0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    xit("cosh(x)", function () {
        const lines: string[] = [
            `circexp(cosh(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("cross(u,v)"));
        engine.release();
    });
    it("curl(v)", function () {
        const lines: string[] = [
            `curl(v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("deg(p,x)", function () {
        const lines: string[] = [
            `deg(a*x^2+b*x+c,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("denominator(x)", function () {
        const lines: string[] = [
            `denominator(a/b)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("b"));
        engine.release();
    });
    it("det(m)", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a*d-b*c"));
        engine.release();
    });
    it("dim(a,m)", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4],[5,6]]`,
            `dim(A,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("3"));
        engine.release();
    });
    it("div(v)", function () {
        const lines: string[] = [
            `div(v)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("div(v)"));
        engine.release();
    });
    it("do(a,b,...)", function () {
        const lines: string[] = [
            `do(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("3"));
        engine.release();
    });
    it("dot(a,b,...)", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `B=[5,6]`,
            `X=dot(inv(A),B)`,
            `X`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[-4,9/2]"));
        engine.release();
    });
    it("draw(f,x)", function () {
        const lines: string[] = [
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    xit("eigenval(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `eigenval(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("eigenvec(m)", function () {
        const lines: string[] = [
            `A=((1,2),(3,4))`,
            `A=A+transpose(A)`,
            `Q=eigenvec(A)`,
            `D=dot(transpose(Q),A,Q)`,
            `dot(Q,D,tanspose(Q))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
            `f=sqrt(x**2 + y**2)`,
            `eval(f,x,3,y,4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("5"));
        engine.release();
    });
    xit("erf(x)", function () {
        const lines: string[] = [
            `erf(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("erfc(x)", function () {
        const lines: string[] = [
            `erfc(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("exp(x)", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `i=sqrt(-1)`,
            `exp(i * pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-1"));
        engine.release();
    });
    it("expand(r,x)", function () {
        const lines: string[] = [
            `expand(r,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("r"));
        engine.release();
    });
    it("expcos(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `expcos(z)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("factor(n)", function () {
        const lines: string[] = [
            `factor(100!)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2**97*3**48*5**24*7**16*11**9*13**7*17**5*19**5*23**4*29**3*31**3*37**2*41**2*43**2*47**2*53*59*61*67*71*73*79*83*89*97"));
        engine.release();
    });
    it("factorial(n)", function () {
        const lines: string[] = [
            `factorial(20)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2432902008176640000"));
        engine.release();
    });
    it("float(x)", function () {
        const lines: string[] = [
            `float(212**17)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("3.5294711457602754e+39"));
        engine.release();
    });
    it("floor(x)", function () {
        const lines: string[] = [
            `floor(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        engine.release();
    });
    xit("for(i,j,k,a,b,...)", function () {
        const lines: string[] = [
            `for(k,1,3,A=k,print(A))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("gcd(a,b,...)", function () {
        const lines: string[] = [
            `gcd(30,42)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("6"));
        engine.release();
    });
    xit("grad(f)", function () {
        const lines: string[] = [
            `grad(f())`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("hermite(x,n)", function () {
        const lines: string[] = [
            `hermite(x,0)`,
            `hermite(x,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 2);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("2*x"));
        engine.release();
    });
    xit("hilbert(n)", function () {
        const lines: string[] = [
            `hilbert(0)`,
            `hilbert(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 2);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("2*x"));
        engine.release();
    });
    it("i", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `i=sqrt(-1)`,
            `exp(i* pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
            `A=[[a,b],[c,d]]`,
            `B=[x,y]`,
            `inner(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[a*x+b*y,c*x+d*y]"));
        engine.release();
    });
    it("integral(f,x)", function () {
        const lines: string[] = [
            `integral(x**2,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1/3*x**3"));
        engine.release();
    });
    it("inv(m)", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[[-2,1],[3/2,-1/2]]"));
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 6);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[4], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[5], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    xit("j", function () {
        const lines: string[] = [
            `j=sqrt(-1)`,
            `1/sqrt(-1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("laguerre(x,n,a)", function () {
        const lines: string[] = [
            `laguerre(x,0)`,
            `laguerre(x,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 2);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("1-x"));
        engine.release();
    });
    it("lcm(a,b,...)", function () {
        const lines: string[] = [
            `lcm(4,6)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("12"));
        engine.release();
    });
    xit("last", function () {
        const lines: string[] = [
            `212^17`,
            `last^(1/17)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("leading(p,x)", function () {
        const lines: string[] = [
            `leading(5*x**2+x+1,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("5"));
        engine.release();
    });
    it("legendre(x,n,m)", function () {
        const lines: string[] = [
            `legendre(x,0)`,
            `legendre(x,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 2);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("x"));
        engine.release();
    });
    it("log(x)", function () {
        const lines: string[] = [
            `log(x**y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("y * log(x)"));
        engine.release();
    });
    xit("lookup(x)", function () {
        const lines: string[] = [
            `x=quote(1+2)`,
            `lookup(x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1 + 2"));
        engine.release();
    });
    xit("mag(z)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `mag(x + i * y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
            `not(0)`,
            `not(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 2);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("0"));
        engine.release();
    });
    xit("nroots(p,x)", function () {
        const lines: string[] = [
            `p=x^5 - 1`,
            `nroots(p,x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("a"));
        engine.release();
    });
    it("or(a,b,...)", function () {
        const lines: string[] = [
            `or(0,0)`,
            `or(0,1)`,
            `or(1,0)`,
            `or(1,1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 4);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("1"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("outer(a,b,...)", function () {
        const lines: string[] = [
            `A=[a,b,c]`,
            `B=[x,y,z]`,
            `outer(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[[a*x,a*y,a*z],[b*x,b*y,b*z],[c*x,c*y,c*z]]"));
        engine.release();
    });
    it("pi", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `i=sqrt(-1)`,
            `exp(i * pi)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("power", function () {
        const lines: string[] = [
            `x**(1/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("x**(1/2)"));
        engine.release();
    });
    it("prime(n)", function () {
        const lines: string[] = [
            `prime(1)`,
            `prime(2)`,
            `prime(3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 3);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("3"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("5"));
        engine.release();
    });
    xit("print(a,b,...)", function () {
        const lines: string[] = [
            `print(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("print2dascii(a,b,...)", function () {
        const lines: string[] = [
            `print2dascii(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("printcomputer(a,b,...)", function () {
        const lines: string[] = [
            `printcomputer(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("printlatex(a,b,...)", function () {
        const lines: string[] = [
            `printlatex(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("printlist(a,b,...)", function () {
        const lines: string[] = [
            `printlist(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("printhuman(a,b,...)", function () {
        const lines: string[] = [
            `printhuman(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    xit("product(i,j,k,f)", function () {
        const lines: string[] = [
            `product(j,1,3,x + j)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
            `quote((x + 1)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("(x + 1)**2"));
        engine.release();
    });
    it("quotient(p,q,x)", function () {
        const lines: string[] = [
            `quotient(x**2+1,x+1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("-1+x"));
        engine.release();
    });
    it("rank(a)", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `rank(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("2"));
        engine.release();
    });
    it("rationalize(x)", function () {
        const lines: string[] = [
            `rationalize(1/a+1/b+1/c)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[-1,2]"));
        engine.release();
    });
    xit("rotate(u,s,k,...)", function () {
        const lines: string[] = [
            `psi=(1,0,0,0)`,
            `rotate(psi,H,0)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("shape(x)", function () {
        const lines: string[] = [
            `shape([a,b,c])`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("[3]"));
        engine.release();
    });
    it("simplify(x)", function () {
        const lines: string[] = [
            `simplify(cos(x)**2+sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("sin(x)", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `sin(pi/2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("sinh(x)", function () {
        const lines: string[] = [
            `sinh(x)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("sinh(x)"));
        engine.release();
    });
    it("sqrt(x)", function () {
        const lines: string[] = [
            `sqrt(factorial(10))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("720*7**(1/2)"));
        engine.release();
    });
    xit("stop", function () {
        const lines: string[] = [
            `stop`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            try {
                engine.valueOf(tree);
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
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("c"));
        engine.release();
    });
    xit("sum(i,j,k,f)", function () {
        const lines: string[] = [
            `sum(j,1,5,x**j)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
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
    it("tan(x)", function () {
        const lines: string[] = [
            `pi=tau(1/2)`,
            `tan(pi/4)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1"));
        engine.release();
    });
    it("tanh(x)", function () {
        const lines: string[] = [
            `circexp(tanh(x))`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("exp(2*x)/(1+exp(2*x))-1/(1+exp(2*x))"));
        engine.release();
    });
    it("tau(n)", function () {
        const lines: string[] = [
            `tau(0)`,
            `tau(1/2)`,
            `tau(1)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 3);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("0"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace("pi"));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace("2*pi"));
        engine.release();
    });
    // Why does this take so long?
    it("taylor(f,x,n,a)", function () {
        const lines: string[] = [
            `taylor(1/(1-x),x,5)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace("1+x+x**2+x**3+x**4+x**5"));
        engine.release();
    });
    it("test(a,b,c,d,...)", function () {
        const lines: string[] = [
            `A=1`,
            `B=1`,
            `test(A==B, "yes", "no")`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`"yes"`));
        engine.release();
    });
    it("trace", function () {
        const lines: string[] = [
            `trace=1`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 0);
        engine.release();
    });
    it("transpose(a,i,j)", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `transpose(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`[[a,c],[b,d]]`));
        engine.release();
    });
    xit("tty", function () {
        const lines: string[] = [
            `tty=1`,
            `(x+1)**2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`1+2*x+x^2`));
        engine.release();
    });
    it("unit(n)", function () {
        const lines: string[] = [
            `unit(3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`[[1,0,0],[0,1,0],[0,0,1]]`));
        engine.release();
    });
    it("uom(s)", function () {
        const lines: string[] = [
            `uom("kilogram")`,
            `uom("meter")`,
            `uom("second")`,
            `uom("coulomb")`,
            `uom("ampere")`,
            `uom("kelvin")`,
            `uom("mole")`,
            `uom("candela")`,
            `uom("newton")`,
            `uom("joule")`,
            `uom("watt")`,
            `uom("volt")`,
            `uom("tesla")`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values = stepModule(module);
        assert.strictEqual(values.length, 13);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`kg`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[1], renderConfig)), stripWhitespace(`m`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[2], renderConfig)), stripWhitespace(`s`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[3], renderConfig)), stripWhitespace(`C`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[4], renderConfig)), stripWhitespace(`A`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[5], renderConfig)), stripWhitespace(`K`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[6], renderConfig)), stripWhitespace(`mol`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[7], renderConfig)), stripWhitespace(`cd`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[8], renderConfig)), stripWhitespace(`N`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[9], renderConfig)), stripWhitespace(`J`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[10], renderConfig)), stripWhitespace(`W`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[11], renderConfig)), stripWhitespace(`V`));
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[12], renderConfig)), stripWhitespace(`T`));
        engine.release();
    });
    it("zero(i,j,...)", function () {
        const lines: string[] = [
            `A=zero(3,3)`,
            //            `for(k,1,3,A[k,k]=k)`,
            `A`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`[[0,0,0],[0,0,0],[0,0,0]]`));
        engine.release();
    });
    it("xyz(a,b,c,...)", function () {
        const lines: string[] = [
            `A=xyz(1,2,3)`,
            `A`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineOptions);
        const { module, errors } = engine.parseModule(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = stepModule(module);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(stripWhitespace(engine.renderAsString(values[0], renderConfig)), stripWhitespace(`xyz(1,2,3)`));
        engine.release();
    });
});