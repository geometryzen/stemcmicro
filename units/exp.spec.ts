import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("exp", function () {
    it("5", function () {
        const lines: string[] = [
            `exp(5)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(power e 5)");
        assert.strictEqual(print_expr(actual, $), "e**5");
        engine.release();
    });
    it("1", function () {
        const lines: string[] = [
            `e=exp(1)`,
            `exp(1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "e");
        assert.strictEqual(print_expr(actual, $), "e");
        engine.release();
    });
    // TODO: We could do better at factoring out the rationals.
    it("-3/4*i*pi", function () {
        const lines: string[] = [
            `exp(-3/4*i*pi)`
        ];
        const engine = createSymEngine({ useDefinitions: true });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "(-1/2-1/2*i)*2**(1/2)");
        engine.release();
    });
});
