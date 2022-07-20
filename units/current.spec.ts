import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("[[a,b],[c,d]]*s", function () {
        const lines: string[] = [
            `[[a,b],[c,d]]*s`
        ];
        const engine = create_engine({
            dependencies: [],
            useDefinitions: false,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[a*s,b*s],[c*s,d*s]]");
        engine.release();
    });
});
