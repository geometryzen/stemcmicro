import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer } from "../index";
import { TransformerPipeline } from "../src/transform/TransformerPipeline";

describe("expand", function () {
    it("(a+b)*c", function () {
        const lines: string[] = [
            `(a+b)*c`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* a c) (* b c))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*c+b*c");
        engine.release();
    });
    it("(a+b+c)*d", function () {
        const lines: string[] = [
            `(a+b+c)*d`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* a d) (* b d) (* c d))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*d+b*d+c*d");
        engine.release();
    });
});
