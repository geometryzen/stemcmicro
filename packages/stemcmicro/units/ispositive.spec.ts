import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("ispositive", function () {
    it("A", function () {
        const lines: string[] = [`ispositive(x)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({
            assumes: {
                x: { positive: true }
            }
        });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    it("B", function () {
        const lines: string[] = [`ispositive(x)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({
            assumes: {
                x: { positive: false }
            }
        });

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("C", function () {
        const lines: string[] = [`ispositive(1)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    it("D", function () {
        const lines: string[] = [`ispositive(0)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("E", function () {
        const lines: string[] = [`ispositive(-1)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("F", function () {
        const lines: string[] = [`ispositive(1.0)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    it("G", function () {
        const lines: string[] = [`ispositive(0.0)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
    it("H", function () {
        const lines: string[] = [`ispositive(-1.0)`];
        const sourceText = lines.join("\n");

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsInfix(values[0]), "false");
        context.release();
    });
});
