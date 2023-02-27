import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("rank", function () {
    it("rank(a)", function () {
        const lines: string[] = [
            `rank(a)`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    xit("rank([a,b,c])", function () {
        const lines: string[] = [
            `rank([a,b,c])`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "1");
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    xit("rank([a,b,c])", function () {
        const lines: string[] = [
            `a=[1,2,3]`,
            `b=[4,5,6]`,
            `c=[5,6,7]`,
            `rank([a,b,c])`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
    xit("rank([[a,b,c]])", function () {
        const lines: string[] = [
            `rank([[a,b,c]])`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
    xit("rank([[a],[b],[c]])", function () {
        const lines: string[] = [
            `rank([[a],[b],[c]])`
        ];
        const engine = create_script_engine({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "2");
        assert.strictEqual(engine.renderAsInfix(values[0]), "2");
        engine.release();
    });
});
