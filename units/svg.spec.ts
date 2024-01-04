
import { assert } from "chai";
import { create_script_context, render_svg } from "../index";
import { DrawContext, EmitContext } from "../src/eigenmath";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("svg", function () {
    it("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x");
        const dc: DrawContext = {
            tmax: +Math.PI,
            tmin: -Math.PI,
            xmax: +10,
            xmin: -10,
            ymax: +10,
            ymin: -10
        };
        const ec: EmitContext = {
            useImaginaryI: true,
            useImaginaryJ: false
        };
        const actual = render_svg(value, dc, ec);
        const expect = `<svg height='36'width='31'><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text>\n</svg><br>`;
        assert.strictEqual(actual, expect);
        engine.release();
    });
});