import assert from 'assert';
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("ordering", function () {
    describe("Positive", function () {
        it("d(c,b)*a", function () {
            const lines: string[] = [
                `d(c,b)*a`
            ];
            const engine = create_script_context({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "a*d(c,b)");
            engine.release();
        });
    });
});
