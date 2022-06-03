import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("", function () {
        const lines: string[] = [
            `float(i)`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt', 'Imu'],
            useCaretForExponentiation: true,    // ^
            useDefinitions: true                 // i
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "i");
        assert.strictEqual(print_expr(actual, $), "i");
        engine.release();
    });
    xit("E", function () {
        const lines: string[] = [
            `float((1+2*i)^(1/2))`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            useCaretForExponentiation: true,    // ^
            useDefinitions: true                 // i
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power (add 1.0 (multiply 2.0 i)) 0.5)");
        assert.strictEqual(print_expr(actual, $), "1.272020...+0.786151...*i");
        engine.release();
    });
});
