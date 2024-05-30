import assert from "assert";
import { is_cons, nil } from "math-expression-tree";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sanity", function () {
    it("is_cons(nil) evaluates to false even though nil is implemented as a Cons", function () {
        assert.strictEqual(is_cons(nil), false);
    });
    it("engine", function () {
        const lines: string[] = [`float(i)`];
        const engine = create_script_context({
            dependencies: ["Flt", "Imu"],
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "i");
        assert.strictEqual(engine.renderAsInfix(actual), "i");
        engine.release();
    });
});
