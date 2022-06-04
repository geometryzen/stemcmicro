import { assert } from "chai";
import { render_as_infix } from "../src/print/print";
import { create_engine } from "../src/runtime/symengine";

describe("round", function () {
    it("3/2", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `round(3/2)`,
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(render_as_infix(values[0], $), "2");
        engine.release();
    });
});
