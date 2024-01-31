import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

describe("print", function () {
    xit("G", function () {
        const lines: string[] = [
            `A=1234`,
            `A`
        ];
        const engine = create_script_context({});
        const { prints } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        engine.release();
    });
    xit("H", function () {
        const lines: string[] = [
            `A=1234`,
            `print(A)`
        ];
        const engine = create_script_context({});
        const { prints } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        engine.release();
    });
    it("-1.0*e2", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            -1.0*e2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "-e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -1.0 e2)");
        engine.release();
    });
    it("-2.0*e2", function () {
        const lines: string[] = [
            `G20=algebra([1,1],["e1","e2"])
            e1=G20[1]
            e2=G20[2]
            -2.0*e2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 4);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "-2.0 e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "-2.0 e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "-2.0*e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "-2.0e2");
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "(* -2.0 e2)");
        engine.release();
    });
});
