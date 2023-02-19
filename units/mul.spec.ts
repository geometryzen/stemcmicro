import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { ExpandingTransformer } from "../src/transform/ExpandingTransformer";
import { ImplicateTransformer } from "../src/transform/ImplicateTransformer";
import { TransformerPipeline } from "../src/transform/TransformerPipeline";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("mul", function () {
    it("(x*x)/x", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `(x*x)/x`
        ];
        const engine = createScriptEngine();
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
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*b*c");
        engine.release();
    });
});
