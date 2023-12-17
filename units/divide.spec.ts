import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("divide", function () {
    xit("a/(a*b)", function () {
        const lines: string[] = [
            `a/(a*b)`
        ];
        const engine = create_script_context();
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/b");
        engine.release();
    });
    xit("b/(a*b)", function () {
        const lines: string[] = [
            `b/(a*b)`
        ];
        const engine = create_script_context();
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(pow a -1)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1/a");
        engine.release();
    });
    xit("b*a", function () {
        const lines: string[] = [
            `b*a`
        ];
        const engine = create_script_context();
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "a*b");
        engine.release();
    });
});
