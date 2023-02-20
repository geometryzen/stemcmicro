import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    xit("???", function () {
        const lines: string[] = [
            `Az*Bx+Ax*By`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), '(+ (* Ax By) (* Az Bx))');
        assert.strictEqual(engine.renderAsInfix(values[0]), "Ax*By+Az*Bx");
        engine.release();
    });
    it("???", function () {
        const lines: string[] = [
            `Az*Bx*Cy+Ax*By*Cz`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), '(+ (* Ax By Cz) (* Az Bx Cy))');
        //assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
        engine.release();
    });
});
