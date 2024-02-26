import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("testgt", function () {
    it("1 > 1", function () {
        const lines: string[] = [
            `1 > 1`
        ];
        const engine = create_script_context({
            useIntegersForPredicates: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("1 > 1", function () {
        const lines: string[] = [
            `1 > 1`
        ];
        const engine = create_script_context({
            useIntegersForPredicates: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    it("1 > 1", function () {
        const lines: string[] = [
            `1 > 1`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
});
