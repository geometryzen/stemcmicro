import { assert } from "chai";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

xdescribe("exp", function () {
    it("A", function () {
        const lines: string[] = [
            `exp(5)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // This smells a bit. Lacks honesty.
        // How to decide when an expression is rendered in the namespace form versus erased form?
        assert.strictEqual($.toListString(actual), "(exp 5)");
        // This smells a bit. Lacks honesty.
        // How to decide when an expression is rendered in the actual form versus interpreted form.
        assert.strictEqual($.toInfixString(actual), "exp(5)");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `e=exp(1)`,
            `exp(1)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toListString(actual), "e");
        assert.strictEqual($.toInfixString(actual), "e");
        engine.release();
    });
    xit("B", function () {
        const lines: string[] = [
            `exp(-3/4*i*pi)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(actual), "-1/2*2**(1/2)-1/2*i*2**(1/2)");
        engine.release();
    });
    xit("C", function () {
        const lines: string[] = [
            `exp(-3/4*i*pi)`
        ];
        const engine = createSymEngine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(actual), "-1/2*2^(1/2)-1/2*i*2^(1/2)");
        engine.release();
    });
});
