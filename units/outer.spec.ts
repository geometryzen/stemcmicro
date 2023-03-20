import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("outer", function () {
    it("A", function () {
        const lines: string[] = [
            `A=[a,b,c]`,
            `B=[x,y,z]`,
            `X=outer(A,B)`,
            `X`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[a*x,a*y,a*z],[b*x,b*y,b*z],[c*x,c*y,c*z]]");
        engine.release();
    });
});
