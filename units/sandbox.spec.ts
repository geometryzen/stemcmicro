import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    it("imag(x+i*y)", function () {
        const lines: string[] = [
            `imag(x+i*y)`
        ];
        const sourceText = lines.join('\n');
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const pipeline = new TransformerPipeline();
        pipeline.addTail(new ImplicateTransformer());
        pipeline.addTail(new ExpandingTransformer());
        const { values } = engine.transformScript(sourceText, pipeline);
        assert.isTrue(Array.isArray(values));
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "y");
        assert.strictEqual(engine.renderAsInfix(values[0]), "y");
        engine.release();
    });
    xit("imag(x+i*y)", function () {
        const lines: string[] = [
            `imag(x+i*y)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "y");
        assert.strictEqual(engine.renderAsInfix(values[0]), "y");
        engine.release();
    });
});
