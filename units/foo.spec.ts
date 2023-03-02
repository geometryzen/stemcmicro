import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("foo", function () {
    it("foo(1)", function () {
        const lines: string[] = [
            `foo(1)`
        ];
        const engine = create_script_engine({
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsAscii(actual), "foo(1)");
        assert.strictEqual(engine.renderAsHuman(actual), "foo(1)");
        assert.strictEqual(engine.renderAsInfix(actual), "foo(1)");
        assert.strictEqual(engine.renderAsLaTeX(actual), "foo(1)");
        assert.strictEqual(engine.renderAsSExpr(actual), "(foo 1)");
        engine.release();
    });
    xit("foo(1,i)", function () {
        const lines: string[] = [
            `foo(1,i)`
        ];
        const engine = create_script_engine({
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsAscii(actual), "foo(1,i)");
        assert.strictEqual(engine.renderAsHuman(actual), "foo(1,i)");
        assert.strictEqual(engine.renderAsInfix(actual), "foo(1,i)");
        assert.strictEqual(engine.renderAsLaTeX(actual), "foo(1,i)");
        assert.strictEqual(engine.renderAsSExpr(actual), "(foo 1 i)");
        engine.release();
    });
});
