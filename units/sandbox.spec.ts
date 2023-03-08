import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("metrics", function () {
    it("AxB with general metric", function () {
        const lines: string[] = [
            `G = algebra([g11,g12,g13],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bz*g12*g13*i-Az*By*g12*g13*i-Ax*Bz*g11*g13*j+Az*Bx*g11*g13*j+Ax*By*g11*g12*k-Ay*Bx*g11*g12*k");
        engine.release();
    });
});
