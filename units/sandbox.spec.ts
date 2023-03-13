
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("real((-1)^(1/3))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `real((-1)^(1/3))`,
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false,
            useCaretForExponentiation: true
        });
        const { values } = context.executeScript(sourceText, {});
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "1/2");
        context.release();
    });
});
