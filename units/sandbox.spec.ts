
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("rendering", function () {
    it("abs(A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `abs(A)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(expt (+ (expt Ax 2) (expt Ay 2) (expt Az 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
});
