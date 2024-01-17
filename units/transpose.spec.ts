import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("transpose", function () {
    it("transpose([[1,2,3,4]])", function () {
        const lines: string[] = [
            `transpose([[1,2,3,4]])`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[1] [2] [3] [4]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1],[2],[3],[4]]");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "\\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\end{bmatrix}");
        engine.release();
    });
});
