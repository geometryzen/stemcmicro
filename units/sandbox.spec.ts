
import { assert } from "chai";
import { U } from "math-expression-tree";
import { create_engine, ExprEngineListener } from "../src/api/api";

class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}

describe("sandbox", function () {
    it("adj", function () {
        const lines: string[] = [
            `adj([[a,b],[c,d]])`,
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine();
        const subscriber = new TestListener();
        engine.addListener(subscriber);
        const { trees, errors } = engine.parse(sourceText);
        if (errors.length > 0) {
            // eslint-disable-next-line no-console
            console.log(errors[0]);
        }
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        const outputs = subscriber.outputs;
        assert.strictEqual(outputs.length, 0);
        assert.strictEqual(engine.renderAsString(values[0]), '[[d,-b],[-c,a]]');
        engine.release();
    });
});
