import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("???", function () {
        const lines: string[] = [
            `log(-1.0)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({ useDefinitions: false });
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "3.141593...*i");
        }
        engine.release();
    });
});
