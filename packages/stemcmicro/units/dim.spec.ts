import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("dim", function () {
    it("dim([[a]],1)", function () {
        const lines: string[] = [`dim([[a]],1)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("dim([[a,b],[c,d]],1)", function () {
        const lines: string[] = [`dim([[a,b],[c,d]],1)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
});
