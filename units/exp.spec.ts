import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("exp", function () {
    it("5", function () {
        const lines: string[] = [
            `exp(5)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(power e 5)");
        assert.strictEqual(render_as_infix(actual, $), "e**5");
        engine.release();
    });
    it("1", function () {
        const lines: string[] = [
            `e=exp(1)`,
            `exp(1)`
        ];
        const engine = create_engine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "e");
        assert.strictEqual(render_as_infix(actual, $), "e");
        engine.release();
    });
    // TODO: We could do better at factoring out the rationals.
    it("exp(-3/4*i*pi)", function () {
        const lines: string[] = [
            `exp(-3/4*i*pi)`
        ];
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_infix(actual, $), "-1/2*2**(1/2)-1/2*2**(1/2)*i");
        // assert.strictEqual(print_expr(actual, $), "(-1/2-1/2*i)*2**(1/2)");
        engine.release();
    });
});
