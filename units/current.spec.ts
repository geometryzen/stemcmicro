import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";

describe("current", function () {
    it("exp(x*i)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(exp(x*i))`
        ];
        const engine = create_engine({
            dependencies: ['Imu']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(cos x)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)");
        engine.release();
    });
});
