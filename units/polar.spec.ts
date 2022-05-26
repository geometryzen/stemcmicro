import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("polar", function () {
    xit("1+i", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `polar(1+i)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(power (+ (power x 2) (power y 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "2^(1/2)*exp(1/4*i*pi)");
        engine.release();
    });
});
