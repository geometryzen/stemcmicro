import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    it("cross(A,B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const beginTime = new Date().getTime();
        const engine = createSymEngine();
        const endTime = new Date().getTime();
        console.log(`createSymEngine took ${endTime - beginTime} ms`);
        const $ = engine.$;
        const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        const elapsedTime = new Date().getTime() - startTime;
        console.log(`cross(A,B) elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(print_expr(value, $), "(Ay*Bz-Az*By)*i+(-Ax*Bz+Az*Bx)*j+(Ax*By-Ay*Bx)*k");
        engine.release();
    });
});
