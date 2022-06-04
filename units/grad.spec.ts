import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("grad", function () {
    xit("grad using Tensor(s)", function () {
        const lines: string[] = [
            `F=[x+2*y,3*x+4*y]`,
            `d(F,[x,y])`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "[[1,2],[3,4]]");
        assert.strictEqual(render_as_infix(actual, $), "[[1,2],[3,4]]");

        engine.release();
    });
    it("grad using Blade(s)", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1, 1], ["e1", "e2", "e3"])`,
            `e1 = G11[1]`,
            `e2 = G11[2]`,
            `e3 = G11[3]`,
            `F=(x+2*y)*e1+(3*x+4*y)*e2`,
            `grad(F)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "(grad F)");
        assert.strictEqual(render_as_infix(actual, $), "grad(F)");

        engine.release();
    });
});
