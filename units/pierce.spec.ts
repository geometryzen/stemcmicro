import { assert } from "chai";
import { createSymEngine } from "../src/runtime/symengine";
import { VERSION_NEXT } from "../src/runtime/version";
import { assert_one_value_execute } from "./assert_one_value_execute";

//
// Examples from Ch1 of Types and Programming Languages by Benjamin C. Pierce
//
xdescribe("Types and Programming Languiages", function () {
    it("createSymEngine and release", function () {
        const engine = createSymEngine({ version: VERSION_NEXT });
        try {
            assert.isDefined(engine);
        }
        finally {
            engine.release();
        }
    });
    it("0", function () {
        const lines: string[] = [
            `0`
        ];
        const engine = createSymEngine({ version: VERSION_NEXT });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toListString(actual), "0");
        assert.strictEqual($.toInfixString(actual), "0");
        engine.release();
    });
    it("true", function () {
        const lines: string[] = [
            `true`
        ];
        const engine = createSymEngine({ version: VERSION_NEXT });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toListString(actual), "true");
        assert.strictEqual($.toInfixString(actual), "true");
        engine.release();
    });
    it("false", function () {
        const lines: string[] = [
            `false`
        ];
        const engine = createSymEngine({ version: VERSION_NEXT });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toListString(actual), "false");
        assert.strictEqual($.toInfixString(actual), "false");
        engine.release();
    });
});
