
import { assert } from "chai";
import { U } from "math-expression-tree";
import { create_engine, ExprEngineListener } from "../src/api/api";

class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}

describe("draw", function () {
    it("sin(x)/x", function () {
        const lines: string[] = [
            `f=sin(x)/x`,
            `yrange=[-1,1]`,
            `draw(f,x)`
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
        assert.strictEqual(values.length, 0);
        const outputs = subscriber.outputs;
        assert.strictEqual(outputs.length, 1);
        // assert.strictEqual(outputs[0], '???');
        engine.release();
    });
});
