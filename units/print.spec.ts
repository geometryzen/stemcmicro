import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("print", function () {
    xit("G", function () {
        const lines: string[] = [
            `A=1234`,
            `A`
        ];
        const engine = create_script_context({});
        const { prints } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        engine.release();
    });
    xit("H", function () {
        const lines: string[] = [
            `A=1234`,
            `print(A)`
        ];
        const engine = create_script_context({});
        const { prints } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(Array.isArray(prints), true);
        assert.strictEqual(prints.length, 1);
        engine.release();
    });
});
