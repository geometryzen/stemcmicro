import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    xit("b*c+a", function () {
        const lines: string[] = [
            `b*c+a`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

        engine.release();
    });
    xit("a+b+b+a", function () {
        const lines: string[] = [
            `a+b+b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 2 a) (* 2 b))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*a+2*b");
        engine.release();
    });
    it("a+2*b+a", function () {
        const lines: string[] = [
            `a+2*b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 2 a) (* 2 b))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*a+2*b");
        engine.release();
    });
});
