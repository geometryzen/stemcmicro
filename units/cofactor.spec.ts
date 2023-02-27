import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cofactor", function () {
    it("cofactor([[1,2],[3,4]],1,1)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],1,1)`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "4");
        assert.strictEqual(engine.renderAsInfix(actual), "4");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],1,2)`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "-3");
        assert.strictEqual(engine.renderAsInfix(actual), "-3");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],2,1)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],2,1)`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "-2");
        assert.strictEqual(engine.renderAsInfix(actual), "-2");
        engine.release();
    });
    it("cofactor([[1,2],[3,4]],2,2)", function () {
        const lines: string[] = [
            `cofactor([[1,2],[3,4]],2,2)`
        ];
        const engine = create_script_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");
        engine.release();
    });
});
