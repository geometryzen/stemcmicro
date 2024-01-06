
import { assert } from "chai";
import { EmitContext, render_svg } from "../src/eigenmath";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("svg", function () {
    it("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x");
        const ec: EmitContext = {
            useImaginaryI: true,
            useImaginaryJ: false
        };
        const actual = render_svg(value, ec);
        const expect = `<svg height='36'width='31'><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text></svg><br>`;
        assert.strictEqual(actual, expect);
        engine.release();
    });
});