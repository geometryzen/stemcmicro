import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("rank", function () {
    it("rank(a)", function () {
        const lines: string[] = [`rank(a)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("rank([a,b,c])", function () {
        const lines: string[] = [`a=[[1],[2]]`, `b=[[3],[4]]`, `c=[[5],[6]]`, `T=[a,b,c]`, `T[1]`, `T[2]`, `T[3]`, `T[1][1]`, `rank(T)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1],[2]]");
        assert.strictEqual(engine.renderAsInfix(values[1]), "[[3],[4]]");
        assert.strictEqual(engine.renderAsInfix(values[2]), "[[5],[6]]");
        assert.strictEqual(engine.renderAsInfix(values[3]), "[1]");
        assert.strictEqual(engine.renderAsInfix(values[4]), "3");
        engine.release();
    });
    it("rank([a,b,c])", function () {
        const lines: string[] = [`rank([a,b,c])`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("rank([a,b,c])", function () {
        const lines: string[] = [`a=[1,2,3]`, `b=[4,5,6]`, `c=[5,6,7]`, `rank([a,b,c])`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
    it("rank([[a,b,c]])", function () {
        const lines: string[] = [`rank([[a,b,c]])`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
    it("rank([[a],[b],[c]])", function () {
        const lines: string[] = [`rank([[a],[b],[c]])`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
});
