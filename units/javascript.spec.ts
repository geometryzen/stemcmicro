import { assert } from "chai";
import { create_int, Str } from "math-expression-atoms";
import { create_tensor } from "../src/brite/create_tensor";
import { ExtensionEnv } from "../src/env/ExtensionEnv";
import { create_uom } from "../src/operators/uom/uom";
import { create_script_context, ScriptContext } from "../src/runtime/script_engine";

function create_str(s: string): Str {
    return new Str(s);
}

describe("JavaScript", function () {
    it("algebra", function () {
        const context: ScriptContext = create_script_context({});
        const $: ExtensionEnv = context.$;
        const metric = create_tensor([create_int(1), create_int(1)]);
        const labels = create_tensor([create_str("L1"), create_str("L2")]);
        const G11 = $.algebra(metric, labels);
        const b1 = $.component(G11, create_int(1));
        const b2 = $.component(G11, create_int(2));
        assert.strictEqual(context.renderAsInfix(b1), "L1");
        assert.strictEqual(context.renderAsInfix(b2), "L2");
        context.release();
    });
    it("complex", function () {
        const context: ScriptContext = create_script_context({});
        const $: ExtensionEnv = context.$;
        const one = create_int(1);
        const two = create_int(2);
        const metric = create_tensor([one, one]);
        const labels = create_tensor([create_str("1"), create_str("e1"), create_str("e2"), create_str("i")]);
        const G11 = $.algebra(metric, labels);
        const e1 = $.component(G11, one);
        const e2 = $.component(G11, two);
        const i = $.outer(e1, e2);
        const g11 = $.inner(e1, e1);
        const g12 = $.inner(e1, e2);
        const g21 = $.inner(e2, e1);
        const g22 = $.inner(e2, e2);
        assert.strictEqual(context.renderAsInfix(e1), "e1");
        assert.strictEqual(context.renderAsInfix(e2), "e2");
        assert.strictEqual(context.renderAsInfix(i), "i");
        assert.strictEqual(context.renderAsInfix($.multiply(i, i)), "-1");
        assert.strictEqual(context.renderAsInfix(g11), "1");
        assert.strictEqual(context.renderAsInfix(g12), "0");
        assert.strictEqual(context.renderAsInfix(g21), "0");
        assert.strictEqual(context.renderAsInfix(g22), "1");
        assert.strictEqual(context.renderAsInfix($.re(one)), "1");
        assert.strictEqual(context.renderAsInfix($.im(one)), "0");
        assert.strictEqual(context.renderAsInfix($.re(i)), "0");
        assert.strictEqual(context.renderAsInfix($.im(i)), "1");
        assert.strictEqual($.isreal(one), true);
        assert.strictEqual($.isimag(one), false);
        assert.strictEqual($.isreal(i), false);
        context.release();
    });
    it("uom", function () {
        const context: ScriptContext = create_script_context({});
        const $: ExtensionEnv = context.$;
        const ampere = create_uom('ampere');
        const candela = create_uom('candela');
        const coulomb = create_uom('coulomb');
        const kelvin = create_uom('kelvin');
        const kilogram = create_uom('kilogram');
        const meter = create_uom('meter');
        const mole = create_uom('mole');
        const second = create_uom('second');
        assert.strictEqual(context.renderAsInfix(ampere), "A");
        assert.strictEqual(context.renderAsInfix(candela), "cd");
        assert.strictEqual(context.renderAsInfix(coulomb), "C");
        assert.strictEqual(context.renderAsInfix(kelvin), "K");
        assert.strictEqual(context.renderAsInfix(kilogram), "kg");
        assert.strictEqual(context.renderAsInfix(meter), "m");
        assert.strictEqual(context.renderAsInfix(mole), "mol");
        assert.strictEqual(context.renderAsInfix(second), "s");
        const two = create_int(2);
        assert.strictEqual(context.renderAsInfix($.multiply(kilogram, meter, $.power(second, $.negate(two)))), "N");
        context.release();
    });
});
