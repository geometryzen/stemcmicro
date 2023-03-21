
import { assert } from "chai";
import { create_int, create_script_context, create_str, create_tensor, ExtensionEnv, ScriptContext } from "../index";

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
});
