import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("A|B-B|A", function () {
        const lines: string[] = [
            `-Ax*By*Cz+Ax*By*Cz`
        ];
        const engine = create_script_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    xit("A|B-B|A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `-Ax*By*i^j+Ax*By*i^j`
        ];
        const engine = create_script_engine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    xit("roots(a*x^2+b*x+c)", function () {
        const lines: string[] = [
            `roots(a*x^2+b*x+c)`
        ];
        const engine = create_script_engine({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-1/2*(b^2/(a^2)-4*c/a)^(1/2)-b/(2*a),1/2*(b^2/(a^2)-4*c/a)^(1/2)-b/(2*a)]");
        engine.release();
    });
});
