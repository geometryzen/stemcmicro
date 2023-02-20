import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("A*A should be equal to A|A (Geometric Algebra)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
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
