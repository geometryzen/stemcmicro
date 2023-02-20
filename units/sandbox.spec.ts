import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("A*A should be equal to A|A (Geometric Algebra)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `A = Ax * e1 + Ay * e2`,
            `A*A`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: ['factorize']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Ax) (* Ay Ay))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Ax+Ay*Ay");
        engine.release();
    });
});
