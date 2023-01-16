import { assert } from "chai";
import { createScriptEngine, is_cons, nil } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sanity", function () {
    it("is_cons(nil) evaluates to false even though nil is implemented as a Cons", function () {
        assert.isFalse(is_cons(nil));
    });
    it("engine", function () {
        const lines: string[] = [
            `float(i)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt', 'Imu'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "i");
        assert.strictEqual(engine.renderAsInfix(actual), "i");
        engine.release();
    });
});
