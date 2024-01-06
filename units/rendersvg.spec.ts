
import { assert } from "chai";
import { create_engine, ExprEngine } from "../src/api/index";
import { render_svg } from "../src/eigenmath";

describe("rendersvg", function () {
    it("", function () {
        const lines: string[] = [
            `x`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine();
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            const svg = render_svg(value, { useImaginaryI: true, useImaginaryJ: false });
            assert.strictEqual(svg, `<svg height='36'width='31'><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text></svg><br>`);
        }
        engine.release();
    });
});