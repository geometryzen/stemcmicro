import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { VERSION_LATEST } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sqrt", function () {
    it("(a) should be converted to a power expression", function () {
        const lines: string[] = [
            `sqrt(a)`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(power a 1/2)');
        assert.strictEqual(render_as_infix(actual, $), 'a**(1/2)');
        engine.release();
    });
});
