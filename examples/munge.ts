import { assert } from "chai";
import { nil, U } from "math-expression-tree";
import { create_engine, ExprEngineListener } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";

class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}
export interface MungeConfig {
    syntaxKind: SyntaxKind;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function munge(sourceText: string, options: Partial<MungeConfig>): U {
    const engine = create_engine(options);
    try {
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
        if (values.length > 0) {
            return values[0];
        }
        else {
            return nil;
        }
    }
    finally {
        engine.release();
    }
}
