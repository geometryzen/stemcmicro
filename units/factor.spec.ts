import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("factor", function () {
    xit("factor(4)", function () {
        const lines: string[] = [
            `factor(4)`
        ];
        const engine = create_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "");
        engine.release();
    });
});
