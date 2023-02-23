import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("A^B+B^A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A^B+B^A`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`A^B+B^A elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
});
