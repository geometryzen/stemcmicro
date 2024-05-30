import assert from "assert";
import { nil, U } from "math-expression-tree";
import { create_engine, ExprEngineListener } from "../src/api/api";

class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}

export function munge(sourceText: string): U {
    const engine = create_engine();
    try {
        const subscriber = new TestListener();
        engine.addListener(subscriber);
        const { trees, errors } = engine.parse(sourceText);
        if (errors.length > 0) {
            // eslint-disable-next-line no-console
            // console.lg(errors[0]);
        }
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        if (values.length > 0) {
            return values[0];
        } else {
            return nil;
        }
    } finally {
        engine.release();
    }
}
