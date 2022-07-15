import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("abs(a+b+i*c)", function () {
        const lines: string[] = [
            `implicate=1`,
            `abs(a+b+i*c)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "(a**2+2*a*b+b**2+c**2)**(1/2)");
        engine.release();
    });
});
