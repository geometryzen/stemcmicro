import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";

describe("round", function () {
    it("3/2", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `round(3/2)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "2");
        engine.release();
    });
});
