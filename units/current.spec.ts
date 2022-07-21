import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("[[a,b],[c,d]]*[[p,q],[r,s]]", function () {
        const lines: string[] = [
            `[[a,b],[c,d]]*[[p,q],[r,s]]`
        ];
        const engine = create_engine({
            dependencies: [],
            useDefinitions: false,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[a*p+b*r,a*q+b*s],[c*p+d*r,c*q+d*s]]");
        engine.release();
    });
});
