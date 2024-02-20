import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("0 != -0", function () {
        const lines: string[] = [
            `0 != -0`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false,
            useIntegersForPredicates: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("(Uom, Rat)", function () {
        const lines: string[] = [
            `kilogram + 2`
        ];
        const engine = create_script_context({
            catchExceptions: true,
            dependencies: ['Uom']
        });
        const { values, errors } = engine.executeScript(lines.join('\n'));
        if (values.length > 0) {
            assert.strictEqual(engine.renderAsInfix(values[0]), `"Operator '+' cannot be applied to types 'rational' and 'uom'."`);
        }
        else {
            assert.strictEqual(errors.length, 1);
            assert.strictEqual(errors[0].message, "kg+2");
        }
        engine.release();
    });
});
