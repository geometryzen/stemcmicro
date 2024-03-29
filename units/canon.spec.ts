import assert from 'assert';
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("canon", function () {
    describe("Ordering", function () {
        it("Imu", function () {
            const lines: string[] = [
                `x*pi*i*2`
            ];
            const engine = create_script_context({
                dependencies: ['Imu'],
                prolog: stemc_prolog
            });
            const expr = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(expr), '2*i*pi*x');
            engine.release();
        });
    });
    it("Powers of x should be Num (x^0), Sym (x^1), x^n (pow x n) with n ascending", function () {
        const lines: string[] = [
            `1/x^2+1/x+1+x+x^2+x^3`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            useCaretForExponentiation: true,
            prolog: stemc_prolog,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1+x+1/x^2+1/x+x^2+x^3");
        engine.release();
    });
    it("1+a+a^2", function () {
        const lines: string[] = [
            `1+a+a^2`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            useCaretForExponentiation: true,
            prolog: stemc_prolog,
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1+a+a^2");
        engine.release();
    });
});
