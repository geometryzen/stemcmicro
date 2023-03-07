import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("imag", function () {
    it("imag(a+i*b)", function () {
        const lines: string[] = [
            `imag(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "b");
        assert.strictEqual(engine.renderAsInfix(values[0]), "b");
        engine.release();
    });
    it("imag(x+i*y)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(x+i*y)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "y");
        engine.release();
    });
    it("imag(1/(x+i*y))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(1/(x+i*y))`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-y/(x^2+y^2)");
        engine.release();
    });
});
