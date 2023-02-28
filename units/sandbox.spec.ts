import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    xit("???", function () {
        const lines: string[] = [
            `x = 5`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine();
        const { values, errors } = engine.executeScript(sourceText);
        for (const error of errors) {
            // eslint-disable-next-line no-console
            console.log("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "1");
        }
        engine.release();
    });
});
