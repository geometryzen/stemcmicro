import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    xit("16*x", function () {
        const lines: string[] = [
            `16*x`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* 16 x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "16*x");
        engine.release();
    });
    xit("hermite(x,4)", function () {
        const lines: string[] = [
            `hermite(x,4)`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        // pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(hermite x 4)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "hermite(x,4)");
        engine.release();
    });
    it("hermite(x,4)", function () {
        const lines: string[] = [
            `hermite(x,4)`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        engine.setAssociationImplicit();
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 16 x x x x) (* -48 x x) 12)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "16*x*x*x*x-48*x*x+12");
        engine.release();
    });
    xit("hermite(x,4)", function () {
        const lines: string[] = [
            `hermite(x,4)`
        ];
        const engine = createScriptEngine({
            disable: ['factorize']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 16 x x x x) (* -48 x x) 12)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "16*x*x*x*x-48*x*x+12");
        engine.release();
    });
    xit("", function () {
        const lines: string[] = [
            `(24*x)*x`
        ];
        const engine = createScriptEngine({
            disable: ['factorize']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* 24 x x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "24*x*x");
        engine.release();
    });
    xit("", function () {
        const lines: string[] = [
            `(-24*x)*x`
        ];
        const engine = createScriptEngine({
            disable: ['factorize']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* -24 x x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "-24*x*x");
        engine.release();
    });
});
