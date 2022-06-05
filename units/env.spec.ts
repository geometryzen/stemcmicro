import { assert } from "chai";
import { render_as_sexpr } from "../index";
import { create_env } from "../src/env/env";
import { create_engine } from "../src/runtime/symengine";
import { Sym } from "../src/tree/sym/Sym";

describe("env", function () {
    describe("constructor", function () {
        it("should be defined", function () {
            const $ = create_env();
            assert.isDefined($);
        });
    });
    describe("negate", function () {
        it("should multiply by minus one.", function () {
            const engine = create_engine();
            const $ = engine.$;
            const x = new Sym('x');
            assert.strictEqual(render_as_sexpr(x, $), 'x');
            const negX = $.negate(x);
            assert.strictEqual(render_as_sexpr(negX, $), '(* -1 x)');
        });
        it("should be an involution.", function () {
            const engine = create_engine();
            const $ = engine.$;
            const x = new Sym('x');
            assert.strictEqual(render_as_sexpr(x, $), 'x');
            const origX = $.negate($.negate(x));
            assert.strictEqual(render_as_sexpr(origX, $), 'x');
        });
    });
});
