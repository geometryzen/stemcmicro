import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("predicates", function () {
    it("A. useIntegersForPredicates is true and return value is false.", function () {
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
    it("B. useIntegersForPredicates is true and return value is true.", function () {
        const lines: string[] = [
            `2 > 1`
        ];
        const engine = create_script_context({
            useIntegersForPredicates: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
        engine.release();
    });
    it("C. useIntegersForPredicates is false and return value is false.", function () {
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
    it("D. useIntegersForPredicates is false and return value is true.", function () {
        const lines: string[] = [
            `2 > 1`
        ];
        const engine = create_script_context({
            useIntegersForPredicates: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "true");
        engine.release();
    });
    it("E. useIntegersForPredicates = false is the default.", function () {
        const lines: string[] = [
            `1 > 1`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "false");
        engine.release();
    });
    it("F. useIntegersForPredicates = false is the default.", function () {
        const lines: string[] = [
            `2 > 1`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "true");
        engine.release();
    });
});
