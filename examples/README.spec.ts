
import { assert } from "chai";
import { is_rat, is_uom } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";
import { create_engine, EngineConfig, ExprEngine, ParseConfig } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

describe("examples", function () {
    it("STEMCscript", function () {
        const lines: string[] = [
            `1 + 2 + 3 + 4`
        ];
        const engineOptions: Partial<EngineConfig> = {
            syntaxKind: SyntaxKind.STEMCscript
        };
        const engine: ExprEngine = create_engine(engineOptions);

        const parseOptions: Partial<ParseConfig> = {
            useCaretForExponentiation: false,
            useParenForTensors: false
        };

        const sourceText = lines.join('\n');
        const { trees, errors } = engine.parse(sourceText, parseOptions);

        assert.strictEqual(errors.length, 0);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `10`);
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("ClojureScript", function () {
        const lines: string[] = [
            `(+ 1 2 3 4)`
        ];
        const engineOptions: Partial<EngineConfig> = {
            syntaxKind: SyntaxKind.ClojureScript
        };
        const engine: ExprEngine = create_engine(engineOptions);

        const parseOptions: Partial<ParseConfig> = {

        };

        const sourceText = lines.join('\n');
        const { trees, errors } = engine.parse(sourceText, parseOptions);

        assert.strictEqual(errors.length, 0);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `10`);
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    it("Eignemath", function () {
        const lines: string[] = [
            `1 + 2 + 3 + 4`
        ];
        const engineOptions: Partial<EngineConfig> = {
            syntaxKind: SyntaxKind.Eigenmath,
            prolog: []
        };
        const engine: ExprEngine = create_engine(engineOptions);

        const parseOptions: Partial<ParseConfig> = {
            useCaretForExponentiation: true,
            useParenForTensors: true
        };

        const sourceText = lines.join('\n');
        const { trees, errors } = engine.parse(sourceText, parseOptions);

        assert.strictEqual(errors.length, 0);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `10`);
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    /*
    xit("PythonScript", function () {
        const lines: string[] = [
            `1 + 2 + 3 + 4`
        ];
        const engineOptions: Partial<EngineConfig> = {
            syntaxKind: SyntaxKind.PythonScript,
            prolog: []
        };
        const engine: ExprEngine = create_engine(engineOptions);

        const parseOptions: Partial<ParseConfig> = {
            useCaretForExponentiation: false,
            useParenForTensors: false
        };

        const sourceText = lines.join('\n');
        const { trees, errors } = engine.parse(sourceText, parseOptions);

        assert.strictEqual(errors.length, 0);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `10`);
        assert.strictEqual(is_rat(values[0]), true);
        engine.release();
    });
    */
    it("STEMCscript", function () {
        const lines: string[] = [
            `joule / coulomb`
        ];
        const engineOptions: Partial<EngineConfig> = {
            syntaxKind: SyntaxKind.STEMCscript,
            prolog: []
        };
        const engine: ExprEngine = create_engine(engineOptions);

        const parseOptions: Partial<ParseConfig> = {
            useCaretForExponentiation: false,
            useParenForTensors: false
        };

        const sourceText = lines.join('\n');
        const { trees, errors } = engine.parse(sourceText, parseOptions);

        assert.strictEqual(errors.length, 0);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `V`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `V`);
        engine.release();
    });
    it("STEMCscript", function () {
        const lines: string[] = [
            `joule / coulomb`
        ];
        const engineOptions: Partial<EngineConfig> = {
            syntaxKind: SyntaxKind.STEMCscript,
            prolog: [
                `joule=uom("joule")`,
                `coulomb=uom("coulomb")`
            ]
        };
        const engine: ExprEngine = create_engine(engineOptions);

        const parseOptions: Partial<ParseConfig> = {
            useCaretForExponentiation: false,
            useParenForTensors: false
        };

        const sourceText = lines.join('\n');
        const { trees, errors } = engine.parse(sourceText, parseOptions);

        assert.strictEqual(errors.length, 0);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), `V`);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), `V`);
        assert.strictEqual(is_uom(values[0]), true);
        engine.release();
    });
});