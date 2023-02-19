import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    it("(a+b+c)*d", function () {
        const lines: string[] = [
            `(a+b+c)*d`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        engine.setAssociationImplicit();
        // engine.setAssociationImplicit();
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* a d) (* b d) (* c d))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*d+b*d+c*d");
        engine.release();
    });
});
