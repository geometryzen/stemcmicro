import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("factorial", function () {
    it("factorial(6)", function () {
        const lines: string[] = [`factorial(6)`];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "720");
        engine.release();
    });
    it("factorial(k)", function () {
        const lines: string[] = [`factorial(k)`];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "k!");
        engine.release();
    });
});
