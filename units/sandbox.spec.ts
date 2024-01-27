
import { assert } from "chai";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";
import { assert_cons } from "../src/tree/cons/assert_cons";

describe("ClojureScript", function () {
    it("let", function () {
        const lines: string[] = [
            `(let [x 1 y x] y)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        try {
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);
            const letExpr = assert_cons(trees[0]);
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'Ascii' }), "let((x,1,y,x),y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'Human' }), "let([x,1,y,x],y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'Infix' }), "let([x,1,y,x],y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'LaTeX' }), "let(\\begin{bmatrix} x & 1 & y & x \\end{bmatrix},y)");
            assert.strictEqual(engine.renderAsString(letExpr, { format: 'SExpr' }), "(let [x 1 y x] y)");
            // assert.strictEqual(engine.renderAsString(letExpr, { format: 'SVG' }), "");
            const value = engine.evaluate(letExpr);
            assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "1");
        }
        finally {
            engine.release();
        }
    });
});