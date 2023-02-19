import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { ExpandingTransformer } from "../src/transform/ExpandingTransformer";
import { ImplicateTransformer } from "../src/transform/ImplicateTransformer";
import { TransformerPipeline } from "../src/transform/TransformerPipeline";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("add", function () {
    it("Flt+Rat", function () {
        // The trouble begins when the symbol is one of the special values... s,t,x,y,z in src/bake.ts
        const lines: string[] = [
            `2.0+3`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '5.0');
        // assert.strictEqual(engine.toListString(actual), '');
        engine.release();
    });
    it("Rat+Flt", function () {
        // The trouble begins when the symbol is one of the special values... s,t,x,y,z in src/bake.ts
        const lines: string[] = [
            `2+3.0`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '5.0');
        // assert.strictEqual(engine.toListString(actual), '');
        engine.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
    it("b+a", function () {
        const lines: string[] = [
            `b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b");
        engine.release();
    });
    it("a+b+c", function () {
        const lines: string[] = [
            `a+b+c`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b+c");
        engine.release();
    });
    it("b+a+c", function () {
        const lines: string[] = [
            `b+a+c`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ a b c)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a+b+c");
        engine.release();
    });
    it("a+b+b+a", function () {
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
    it("a+b+c+c+b+a", function () {
        const lines: string[] = [
            `a+b+c+c+b+a`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({ useCaretForExponentiation: true });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* 2 a) (* 2 b) (* 2 c))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*a+2*b+2*c");
        engine.release();
    });
});
