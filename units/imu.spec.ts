import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("imu", function () {
    it("((-2.0*(-1)**(1/2))*2.0)*(-1)**(1/2)", function () {
        const lines: string[] = [
            `implicate=0`,
            `((-2.0*(-1)**(1/2))*2.0)*(-1)**(1/2)`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt', 'Imu']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "4.0");
        assert.strictEqual(print_expr(actual, $), "4.0");

        engine.release();
    });
});
