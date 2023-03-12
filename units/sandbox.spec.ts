
import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs", function () {
    xit("real(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a");
        engine.release();
    });
    xit("imag(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "b");
        engine.release();
    });
    xit("1/(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `1/(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(expt (+ a (* i b)) -1)");
        assert.strictEqual(engine.renderAsInfix(value), "1/(a+i*b)");
        engine.release();
    });
    it("real(1/(a+i*b))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `real(1/(a+i*b))`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a/(a^2+b^2)");
        engine.release();
    });
    xit("imag(1/(a+i*b))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `imag(1/(a+i*b))`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-b/(a^2+b^2)");
        engine.release();
    });
    xit("abs(a+i*b)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs(a+i*b)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(a^2+b^2)^(1/2)");
        engine.release();
    });
    xit("(a+i*b)/(c+i*d)", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `(a+i*b)/(c+i*d)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a/(c+i*d)+i*b/(c+i*d)");
        engine.release();
    });
    xit("abs((a+i*b)/(c+i*d))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `abs((a+i*b)/(c+i*d))`
        ];
        const engine = create_script_context({
            dependencies: ['Blade'],
            useCaretForExponentiation: true,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(a^2+b^2)^(1/2)/((c^2+d^2)^(1/2))");
        engine.release();
    });
});
