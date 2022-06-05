import { assert } from "chai";
import { create_engine } from "../index";

describe("example", function () {
    it("...", function () {
        const lines: string[] = [
            `a/b`
        ];
        const eng = create_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        assert.strictEqual(eng.renderAsInfix(values[0]), "a/b");
        assert.strictEqual(eng.renderAsSExpr(values[0]), "(* a (power b -1))");
        assert.strictEqual(eng.renderAsLaTeX(values[0]), "\\frac{a}{b}");
        eng.release();
    });
});
