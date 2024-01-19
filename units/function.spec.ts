
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("function", function () {
    it("f(x)", function () {
        const lines: string[] = [
            `f(x)=2*x`,
            `f`
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "function (x) -> 2*x");
        assert.strictEqual(engine.renderAsSExpr(value), "(function (* 2 x) (x))");
        engine.release();
    });
    it("f(a)", function () {
        const lines: string[] = [
            `f(x)=2*x`,
            `f(a)`
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2*a");
        assert.strictEqual(engine.renderAsSExpr(value), "(* 2 a)");
        engine.release();
    });
});