import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("imu", function () {
    it("((-2.0*(-1)**(1/2))*2.0)*(-1)**(1/2)", function () {
        const lines: string[] = [
            `((-2.0*(-1)**(1/2))*2.0)*(-1)**(1/2)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt', 'Imu']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "4.0");
        assert.strictEqual(engine.renderAsInfix(actual), "4.0");

        engine.release();
    });
});
