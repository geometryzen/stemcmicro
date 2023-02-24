import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("A*A should be equal to A|A (Geometric Algebra)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["i","j","k"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `cross(e1,a*b*e2)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: ['factorize']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "k");
        engine.release();
    });
});
