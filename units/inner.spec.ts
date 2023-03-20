import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("inner", function () {
    it("A", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `B=[x,y]`,
            `X=inner(A,B)`,
            `X`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[a*x+b*y,c*x+d*y]");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `B=[5,6]`,
            `X=inner(inv(A),B)`,
            `X`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[-4,9/2]");
        // | -4  |
        // | 9/2 |
        assert.strictEqual(engine.renderAsInfix(values[0]), "[-4,9/2]");
        engine.release();
    });
});
