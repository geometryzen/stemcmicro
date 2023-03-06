import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("(Ax*e1)*(By*e2)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `(a*b)*e1`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(engine.renderAsSExpr(value), "(* Ax By e1^e2)");
        assert.strictEqual(engine.renderAsInfix(value), "a*b*e1");
        engine.release();
    });
});
