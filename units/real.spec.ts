import { assert } from "chai";
import { create_engine, render_as_infix, render_as_sexpr } from "../index";

describe("real", function () {
    it("real(x+i*y) => x", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(x+i*y)`
        ];
        const engine = create_engine({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        assert.strictEqual(render_as_sexpr(values[0], $), "x");
        assert.strictEqual(render_as_infix(values[0], $), "x");
        engine.release();
    });
    it("real(exp(i*x)) => cos(x)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(exp(i*x))`
        ];
        const engine = create_engine({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        // Having trouble ordering and simplifying.
        assert.strictEqual(render_as_sexpr(values[0], $), "(cos x)");
        assert.strictEqual(render_as_infix(values[0], $), "cos(x)");
        engine.release();
    });
});
