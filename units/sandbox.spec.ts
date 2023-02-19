import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine, ExpandingTransformer, ImplicateTransformer, TransformerPipeline } from "../index";

describe("sandbox", function () {
    xit("abs(x+i*y)", function () {
        const lines: string[] = [
            `abs(x+i*y)`
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
        const value = values[0];
        assert.strictEqual(engine.renderAsSExpr(value), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(x**2+y**2)**(1/2)");
        engine.release();
    });
    xit("abs(x+i*y)", function () {
        const lines: string[] = [
            `abs(x+i*y)`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(x**2+y**2)**(1/2)");
        engine.release();
    });
});
