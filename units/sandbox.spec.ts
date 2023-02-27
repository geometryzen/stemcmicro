import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { ExpandingTransformer } from "../src/transform/ExpandingTransformer";
import { TransformerPipeline } from "../src/transform/TransformerPipeline";

describe("sandbox", function () {
    it("a*0.0", function () {
        const lines: string[] = [
            `a*b*0.0`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsInfix(values[0]), "0.0");
        engine.release();
    });
});
