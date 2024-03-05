
import assert from "assert";
import { create_engine, EngineConfig, ExprEngine, RenderConfig } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";

const engineConfig: Partial<EngineConfig> = {
    syntaxKind: SyntaxKind.JavaScript
};

const infixConfig: RenderConfig = {
    format: 'Infix',
    useCaretForExponentiation: false,
    useParenForTensors: false
};

const sexprConfig: RenderConfig = {
    format: 'SExpr',
    useCaretForExponentiation: false,
    useParenForTensors: false
};

describe("jsparse", function () {
    it("should be able to parse a user symbol", function () {
        const lines: string[] = [
            `x`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "x");
        engine.release();
    });
    it("should be able to parse a Rat", function () {
        const lines: string[] = [
            `12345`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "12345");
        engine.release();
    });
    it("should be able to parse a Flt", function () {
        const lines: string[] = [
            `12345.0`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "12345.0");
        engine.release();
    });
    it("should be able to parse a Str", function () {
        const lines: string[] = [
            `"Hello"`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), '"Hello"');
        engine.release();
    });
    it("should be able to parse 'true'", function () {
        const lines: string[] = [
            `true`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'true');
        engine.release();
    });
    it("should be able to parse 'false'", function () {
        const lines: string[] = [
            `false`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'false');
        engine.release();
    });
    it("should be able to parse an additive (+) expression", function () {
        const lines: string[] = [
            `a+b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a+b');
        engine.release();
    });
    it("should be able to parse an additive (-) expression", function () {
        const lines: string[] = [
            `a-b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a-b');
        engine.release();
    });
    it("should be able to parse an multiplicative (*) expression", function () {
        const lines: string[] = [
            `a*b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a*b');
        engine.release();
    });
    it("should be able to parse an multiplicative (/) expression", function () {
        const lines: string[] = [
            `a/b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a/b');
        engine.release();
    });
    it("should be able to parse an outer product '^' expression", function () {
        const lines: string[] = [
            `a^b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a^b');
        engine.release();
    });
    it("should be able to parse an interior product '|' expression", function () {
        const lines: string[] = [
            `a|b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a|b');
        engine.release();
    });
    it("should be able to parse a left contraction(<<) expression", function () {
        const lines: string[] = [
            `a<<b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a<<b');
        engine.release();
    });
    it("should be able to parse a right contraction(>>) expression", function () {
        const lines: string[] = [
            `a>>b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a>>b');
        engine.release();
    });
    it("should be able to parse an exponentiation (**) expression", function () {
        const lines: string[] = [
            `a**b`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'a**b');
        engine.release();
    });
    it("should be able to parse an assignment expression", function () {
        const lines: string[] = [
            `x = 23`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'x=23');
        engine.release();
    });
    it("should be able to parse a function call expression", function () {
        const lines: string[] = [
            `foo(1,2,3)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'foo(1,2,3)');
        engine.release();
    });
    it("should be able to parse an array expression", function () {
        const lines: string[] = [
            `[1,2,3]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), '[1,2,3]');
        engine.release();
    });
    it("should be able to parse a member expression", function () {
        const lines: string[] = [
            `x[1,2,3]`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'x[1,2,3]');
        assert.strictEqual(engine.renderAsString(trees[0], sexprConfig), '(component x 1 2 3)');
        engine.release();
    });
    it("should be able to parse a null Literal", function () {
        const lines: string[] = [
            `null`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), '()');
        assert.strictEqual(engine.renderAsString(trees[0], sexprConfig), '()');
        engine.release();
    });
});