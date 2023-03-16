
import { assert } from "chai";
import { Directive } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("sgn(a*b)", function () {
        const lines: string[] = [
            `sgn(a*b)`
        ];
        const engine = create_script_context({
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "a*b/(abs(a)*abs(b))");
        engine.release();
    });
    xit("1/b*1/(a+b*x)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `1/b*1/(a+b*x)`
        ];
        const engine = create_script_context({
            disables: [Directive.factor],
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/(a*b+x*b^2)");
        engine.release();
    });
});
