
import { assert } from "chai";
import { create_engine, ExprEngine } from "../src/api/index";
import { assert_cons } from "../src/tree/cons/assert_cons";

describe("sandbox", function () {
    it("-Sym", function () {
        const lines: string[] = [
            `-a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (* a -1))`);
        const powExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(powExpr, { format: 'SExpr' }), "(* a -1)");
        assert.strictEqual(powExpr.pos, 0);
        assert.strictEqual(powExpr.end, 2);
        
        const base = powExpr.base;
        assert.strictEqual(engine.renderAsString(base, { format: 'SExpr' }), "a");
        assert.strictEqual(base.pos, 1);
        assert.strictEqual(base.end, 2);
        
        const expo = powExpr.expo;
        assert.strictEqual(engine.renderAsString(expo, { format: 'SExpr' }), "-1");
        assert.strictEqual(expo.pos, void 0);
        assert.strictEqual(expo.end, void 0);

        engine.release();
    });
});