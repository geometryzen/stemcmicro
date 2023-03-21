
import { assert } from "chai";
import { create_script_context } from "../index";

describe("sandbox", function () {
    xit("A", function () {
        const lines: string[] = [
            `P=[x,y,z]`,
            `d(P,x)`,
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[1,0,0]");
        engine.release();
    });
});
