
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("iscomplex(z)", function () {
        const lines: string[] = [
            `iscomplex(z)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values, errors } = context.executeScript(sourceText, {});
        assert.isArray(errors);
        assert.strictEqual(errors.length, 0);
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "#t");
        assert.strictEqual(context.renderAsInfix(values[0]), "true");
        context.release();
    });
    xit("imag(1/(c+i*d))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `imag(1/(c+i*d))`,
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: false,
            useCaretForExponentiation: true
        });
        const { values } = context.executeScript(sourceText, {});
        assert.isArray(values);
        assert.strictEqual(values.length, 1);
        assert.strictEqual(context.renderAsSExpr(values[0]), "");
        assert.strictEqual(context.renderAsInfix(values[0]), "-i*d/(c^2+d^2)^(1/2)");
        context.release();
    });
});
