import { assert } from "chai";
import { createEnv } from "../src/env/env";
import { print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { Sym } from "../src/tree/sym/Sym";

describe("env", function () {
    describe("constructor", function () {
        it("should be defined", function () {
            const $ = createEnv();
            assert.isDefined($);
        });
    });
    describe("negate", function () {
        it("should multiply by minus one.", function () {
            const engine = createSymEngine();
            const $ = engine.$;
            const x = new Sym('x');
            assert.strictEqual(print_list(x, $), 'x');
            const negX = $.negate(x);
            assert.strictEqual(print_list(negX, $), '(* -1 x)');
        });
        it("should be an involution.", function () {
            const engine = createSymEngine();
            const $ = engine.$;
            const x = new Sym('x');
            assert.strictEqual(print_list(x, $), 'x');
            const origX = $.negate($.negate(x));
            assert.strictEqual(print_list(origX, $), 'x');
        });
    });
});
