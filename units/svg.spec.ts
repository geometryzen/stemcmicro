
import { assert } from "chai";
import { Sym } from "math-expression-atoms";
import { EigenmathReadScope, EmitContext, render_svg } from "../src/eigenmath/eigenmath";
import { create_script_context, ScriptContext } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

class TestScope implements EigenmathReadScope {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasBinding(sym: Sym): boolean {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasUserFunction(sym: Sym): boolean {
        throw new Error("Method not implemented.");
    }
}

describe("svg", function () {
    xit("x", function () {
        const lines: string[] = [
            `x`,
        ];
        const engine: ScriptContext = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x");
        const ec: EmitContext = {
            useImaginaryI: true,
            useImaginaryJ: false
        };
        // TODO: ScriptContext does not provide information to support EigenmathScope.
        const scope = new TestScope();
        const actual = render_svg(value, ec, scope);
        const expect = `<svg height='36'width='31'><text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text></svg>`;
        assert.strictEqual(actual, expect);
        engine.release();
    });
});