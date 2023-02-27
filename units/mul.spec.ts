import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { ExpandingTransformer } from "../src/transform/ExpandingTransformer";
import { TransformerPipeline } from "../src/transform/TransformerPipeline";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("mul", function () {
    it("(x*x)/x", function () {
        const lines: string[] = [
            `(x*x)/x`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "x");
        assert.strictEqual(engine.renderAsInfix(actual), "x");

        engine.release();
    });
    it("(a*b)*c", function () {
        const lines: string[] = [
            `(a*b)*c`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*b*c");
        engine.release();
    });
});
