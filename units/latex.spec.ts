import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("latex", function () {
    it("outer", function () {
        const lines: string[] = [
            `a^b`
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const data = engine.executeScript(lines.join('\n'));
        const actual = data.values[0];
        assert.strictEqual(engine.renderAsSExpr(actual), "(^ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a^b");
        assert.strictEqual(engine.renderAsLaTeX(actual), "a \\wedge b");
        engine.release();
    });
    it("inner", function () {
        const lines: string[] = [
            `a|b`
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const data = engine.executeScript(lines.join('\n'));
        const actual = data.values[0];
        assert.strictEqual(engine.renderAsSExpr(actual), "(| a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a|b");
        assert.strictEqual(engine.renderAsLaTeX(actual), "a \\mid b");
        engine.release();
    });
    it("lco", function () {
        const lines: string[] = [
            `a<<b`
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const data = engine.executeScript(lines.join('\n'));
        const actual = data.values[0];
        assert.strictEqual(engine.renderAsSExpr(actual), "(<< a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a<<b");
        assert.strictEqual(engine.renderAsLaTeX(actual), "a \\ll b");
        engine.release();
    });
    it("rco", function () {
        const lines: string[] = [
            `a>>b`
        ];
        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const data = engine.executeScript(lines.join('\n'));
        const actual = data.values[0];
        assert.strictEqual(engine.renderAsSExpr(actual), "(>> a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a>>b");
        assert.strictEqual(engine.renderAsLaTeX(actual), "a \\gg b");
        engine.release();
    });
});
