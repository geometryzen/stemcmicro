import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("rank([a,b,c])", function () {
        const lines: string[] = [
            `a=[[1],[2]]`,
            `b=[[3],[4]]`,
            `c=[[5],[6]]`,
            `T=[a,b,c]`,
            `T[1]`,
            `T[2]`,
            `T[3]`,
            `T[1][1]`,
            `rank(T)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1],[2]]");
        assert.strictEqual(engine.renderAsInfix(values[1]), "[[3],[4]]");
        assert.strictEqual(engine.renderAsInfix(values[2]), "[[5],[6]]");
        assert.strictEqual(engine.renderAsInfix(values[3]), "[1]");
        assert.strictEqual(engine.renderAsInfix(values[4]), "3");
        engine.release();
    });
});
