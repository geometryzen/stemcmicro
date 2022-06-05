import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("", function () {
        const lines: string[] = [
            `float(i)`
        ];
        const engine = create_engine({
            dependencies: ['Flt', 'Imu'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "i");
        assert.strictEqual(engine.renderAsInfix(actual), "i");
        engine.release();
    });
    xit("E", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true,
            useDefinitions: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(engine.renderAsInfix(actual), "1.272020...+0.786151...*i");
        engine.release();
    });
});
