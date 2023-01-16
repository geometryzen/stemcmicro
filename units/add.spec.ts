import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("add", function () {
    it("Flt+Rat", function () {
        // The trouble begins when the symbol is one of the special values... s,t,x,y,z in src/bake.ts
        const lines: string[] = [
            `2.0+3`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '5.0');
        // assert.strictEqual(engine.toListString(actual), '');
        engine.release();
    });
    it("Rat+Flt", function () {
        // The trouble begins when the symbol is one of the special values... s,t,x,y,z in src/bake.ts
        const lines: string[] = [
            `2+3.0`
        ];
        const engine = createScriptEngine({
            dependencies: ['Flt']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), '5.0');
        // assert.strictEqual(engine.toListString(actual), '');
        engine.release();
    });
});
