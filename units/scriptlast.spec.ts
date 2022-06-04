import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../src/print";
import { create_engine } from "../src/runtime/symengine";
import { VERSION_LATEST } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("scriptlast", function () {
    it("", function () {
        const lines: string[] = [
            `5`
        ];
        const engine = create_engine({ version: VERSION_LATEST });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '5');
        assert.strictEqual(render_as_infix(actual, $), '5');
        engine.release();
    });
});
