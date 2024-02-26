import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("dot", function () {
    it("A", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `B=[5,6]`,
            `X=dot(inv(A),B)`,
            `X`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[-4 9/2]");
        // | -4  |
        // | 9/2 |
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-4,9/2]");
        engine.release();
    });
});
