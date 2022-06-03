import { assert } from 'chai';
import { is_uom } from '../index';
import { print_expr, print_list } from '../src/print';
import { createSymEngine } from '../src/runtime/symengine';
import { assert_one_value_execute } from './assert_one_value_execute';

describe("SI units", function () {
    it("(Uom, Rat)", function () {
        const lines: string[] = [
            `kg = uom("kilogram")`,
            `kg / 5`
        ];
        const engine = createSymEngine({
            dependencies: ['Uom']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* 1/5 kg)");
        assert.strictEqual(print_expr(actual, $), "1/5*kg");
        engine.release();
    });
    it("(Uom, Flt)", function () {
        const lines: string[] = [
            `kg = uom("kilogram")`,
            `kg / 5.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt', 'Uom']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* 0.2 kg)");
        assert.strictEqual(print_expr(actual, $), "0.2*kg");
        engine.release();
    });
});

describe("uom", function () {
    describe("SI units", function () {
        it("kilogram", function () {
            const lines: string[] = [
                `uom("kilogram")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "kg");
            engine.release();
        });
        it("meter", function () {
            const lines: string[] = [
                `uom("meter")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "m");
            engine.release();
        });
        it("second", function () {
            const lines: string[] = [
                `uom("second")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "s");
            engine.release();
        });
        it("coulomb", function () {
            const lines: string[] = [
                `uom("coulomb")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "C");
            engine.release();
        });
        it("ampere", function () {
            const lines: string[] = [
                `uom("ampere")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "A");
            engine.release();
        });
        it("kelvin", function () {
            const lines: string[] = [
                `uom("kelvin")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "K");
            engine.release();
        });
        it("mole", function () {
            const lines: string[] = [
                `uom("mole")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "mol");
            engine.release();
        });
        it("candela", function () {
            const lines: string[] = [
                `uom("candela")`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "cd");
            engine.release();
        });
    });
    describe("operator *", function () {
        it("(Uom, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `m = uom("meter")`,
                `kg * m`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "kg m");
            engine.release();
        });
        it("(Flt, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `5.0 * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Flt', 'Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "5.0*kg");
            engine.release();
        });
        it("(Uom, Flt)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg * 5.0`
            ];
            const engine = createSymEngine({
                dependencies: ['Flt', 'Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "5.0*kg");
            engine.release();
        });
        it("(Num, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `2 * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "2*kg");
            engine.release();
        });
        it("(Uom, Num)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg * 2`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "2*kg");
            engine.release();
        });
        it("(Vec, Uom)", function () {
            const lines: string[] = [
                `G = algebra([1],["e1"])`,
                `e1=G[1]`,
                `kg = uom("kilogram")`,
                `e1 * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "e1*kg");
            engine.release();
        });
        it("(Uom, Vec)", function () {
            const lines: string[] = [
                `G = algebra([1],["e1"])`,
                `e1=G[1]`,
                `kg = uom("kilogram")`,
                `kg * e1`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "e1*kg");
            engine.release();
        });
    });
    describe("operator /", function () {
        it("(Uom, Uom)", function () {
            const lines: string[] = [
                `m = uom("meter")`,
                `s = uom("second")`,
                `m / s`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(print_expr(actual, $), "m/s");
            }
            else {
                assert.fail(`${JSON.stringify(actual)}`);
            }
            engine.release();
        });
        it("(Flt, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `5.0 / kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Flt', 'Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "5.0*kg ** -1");
            engine.release();
        });
        it("(Uom, Flt)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg / 5.0`
            ];
            const engine = createSymEngine({
                dependencies: ['Flt', 'Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* 0.2 kg)");
            assert.strictEqual(print_expr(actual, $), "0.2*kg");
            engine.release();
        });
        it("(Num, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `2 / kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "2*kg ** -1");
            engine.release();
        });
        it("(Uom, Num)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg / 2`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "1/2*kg");
            engine.release();
        });
    });
    describe("operator +", function () {
        it("(Uom, Uom)", function () {
            const lines: string[] = [
                `m = uom("meter")`,
                `m + m`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(actual, $), "2*m");
            engine.release();
        });
        it("(Flt, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `6.0 + kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Flt', 'Uom'],
                version: 2
            });
            const $ = engine.$;
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(print_expr(values[0], $), "operator + (Flt, Uom) is not supported.");
            engine.release();
        });
        it("(Uom, Flt)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg + 5.0`
            ];
            const engine = createSymEngine({
                dependencies: ['Flt', 'Uom']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            const $ = engine.$;
            assert.strictEqual(print_expr(values[0], $), "operator + (Uom, Flt) is not supported.");
            engine.release();
        });
        it("(Rat, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `2 + kg`
            ];
            const engine = createSymEngine({ version: 2 });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(print_expr(values[0], engine.$), "operator + (Rat, Uom) is not supported.");
            engine.release();
        });
        it("(Uom, Rat)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg + 2`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom'],
                version: 2
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(print_expr(values[0], engine.$), "operator + (Uom, Rat) is not supported.");
            engine.release();
        });
    });
    describe("derived", function () {
        it("kg * m / s / s => N", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `m = uom("meter")`,
                `s = uom("second")`,
                `kg * m / s / s`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(print_expr(actual, $), "N");
            }
            else {
                assert.fail(`${JSON.stringify(actual)}`);
            }
            engine.release();
        });
        it("kg * m / (s * s) => N", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `m = uom("meter")`,
                `s = uom("second")`,
                `kg * m / (s * s)`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(print_expr(actual, $), "N");
            }
            else {
                assert.fail(`${JSON.stringify(actual)}`);
            }
            engine.release();
        });
        it("kg * m / s ** 2 => N", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `m = uom("meter")`,
                `s = uom("second")`,
                `kg * m / s ** 2`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(print_expr(actual, $), "N");
            }
            else {
                assert.fail(`${JSON.stringify(actual)}`);
            }
            engine.release();
        });
        it("J / C => V", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `m = uom("meter")`,
                `s = uom("second")`,
                `C = uom("coulomb")`,
                `N = kg * m / s / s`,
                `J = N * m`,
                `J / C`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(print_expr(actual, $), "V");
            }
            else {
                assert.fail(`${JSON.stringify(actual)}`);
            }
            engine.release();
        });
        it("A * s => C", function () {
            const lines: string[] = [
                `A = uom("ampere")`,
                `s = uom("second")`,
                `A * s`
            ];
            const engine = createSymEngine({
                dependencies: ['Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(value)) {
                assert.strictEqual($.toInfixString(value), "C");
            }
            else {
                assert.fail(`${JSON.stringify(value)}`);
            }
            engine.release();
        });
    });
});
