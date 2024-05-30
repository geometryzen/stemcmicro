import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("arccosh", function () {
    it("arccosh(1)", function () {
        const lines: string[] = [`arccosh(1)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
