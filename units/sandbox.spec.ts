import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    it("2*a*b-a*b I", function () {
        const lines: string[] = [
            `2*a*b-a*b`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), '(* a b)');
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
        engine.release();
    });
    it("2*a*b-a*b II", function () {
        const lines: string[] = [
            `implicate=0`,
            `2*a*b-a*b`,
        ];
        const engine = createScriptEngine({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(* a b)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a*b');
        engine.release();
    });

});
