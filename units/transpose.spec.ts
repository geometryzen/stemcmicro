import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("transpose", function () {
    it("transpose([[1,2,3,4]])", function () {
        const lines: string[] = [
            `transpose([[1,2,3,4]])`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[[1],[2],[3],[4]]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1],[2],[3],[4]]");
        assert.strictEqual(engine.renderAsLaTeX(values[0]), "\\begin{bmatrix} 1 \\\\ 2 \\\\ 3 \\\\ 4 \\end{bmatrix}");
        engine.release();
    });
});
