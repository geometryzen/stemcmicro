import { assert } from 'chai';
import { is_rat, is_uom } from 'math-expression-atoms';
import { is_nil, U } from 'math-expression-tree';
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from '../src/parser/parser';
import { create_script_context } from '../src/runtime/script_engine';
import { assert_one_value_execute } from './assert_one_value_execute';

describe("uom", function () {
    it("GA and uom", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `m=uom("meter")`,
            `s=uom("second")`,
            `g=9.81*(-e2) * m/s/s`,
            `g`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.STEMCscript });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value), "-9.81*e2*m/s ** 2");
            }
        }
        engine.release();
    });
    xit("Handling middot", function () {
        const lines: string[] = [
            `k=uom("kilogram")`,
            `m=uom("meter")`,
            `s=uom("second")`,
            `k * m / s`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.STEMCscript });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "kg·m/s");
                assert.strictEqual(engine.renderAsString(value, { format: 'LaTeX' }), "kg·m/s");
                const lines: string[] = [
                    `<svg height='41'width='89'>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>k</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='22'y='26'>g</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='34'y='26'>&middot;</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='44.65234375'y='26'>m</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='63.3203125'y='26'>/</text>`,
                    `<text style='font-family:"Times New Roman";font-size:24px;'x='69.98828125'y='26'>s</text>`,
                    `</svg>`
                ];
                assert.strictEqual(engine.renderAsString(value, { format: 'SVG' }), lines.join(''));
            }
        }
        engine.release();
    });
    it("simplifying expressions containing Uom", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1  = G30[1]`,
            `e2  = G30[2]`,
            `e3  = G30[3]`,
            ``,
            `kilogram=uom("kilogram")`,
            `meter=uom("meter")
            second=uom("second")
            gravity = g * (-e2) * meter / second / second
            mass = M * kilogram
            F = mass * gravity
            # unit vector up the slope
            es = cos(theta) * e1 + sin(theta) * e2
            # unit vector perpendicular and out of the slope
            en = -sin(theta) * e1 + cos(theta) * e2
            # If the block is not accelerating then the net force must be zero
            NetF = R * en + S * es + F
            # Component in the plane of the slope must be zero, display S.
            S-simplify(NetF|es)
            # Component perpendicular must be zero
            # NetF|en`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.STEMCscript });
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "M*g*sin(theta)*N");
            }
        }
        engine.release();
    });
});

describe("SI units", function () {
    it("/(Uom, Flt)", function () {
        const lines: string[] = [
            `kg = uom("kilogram")`,
            `kg / 5.0`
        ];
        const engine = create_script_context({
            dependencies: ['Flt', 'Uom']
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 0.2 kg)");
        assert.strictEqual(engine.renderAsInfix(actual), "0.2*kg");
        engine.release();
    });
});

describe("uom", function () {
    describe("SI units", function () {
        it("kilogram", function () {
            const lines: string[] = [
                `uom("kilogram")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "kg");
            engine.release();
        });
        it("meter", function () {
            const lines: string[] = [
                `uom("meter")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "m");
            engine.release();
        });
        it("second", function () {
            const lines: string[] = [
                `uom("second")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "s");
            engine.release();
        });
        it("coulomb", function () {
            const lines: string[] = [
                `uom("coulomb")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "C");
            engine.release();
        });
        it("ampere", function () {
            const lines: string[] = [
                `uom("ampere")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "A");
            engine.release();
        });
        it("kelvin", function () {
            const lines: string[] = [
                `uom("kelvin")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "K");
            engine.release();
        });
        it("mole", function () {
            const lines: string[] = [
                `uom("mole")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "mol");
            engine.release();
        });
        it("candela", function () {
            const lines: string[] = [
                `uom("candela")`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "cd");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "kg m");
            engine.release();
        });
        it("(Flt, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `5.0 * kg`
            ];
            const engine = create_script_context({
                dependencies: ['Flt', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "5.0*kg");
            engine.release();
        });
        it("*(Uom, Flt)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg * 5.0`
            ];
            const engine = create_script_context({
                dependencies: ['Flt', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "5.0*kg");
            engine.release();
        });
        it("(Num, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `2 * kg`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "2*kg");
            engine.release();
        });
        it("(Uom, Num)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg * 2`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "2*kg");
            engine.release();
        });
        it("(Vec, Uom)", function () {
            const lines: string[] = [
                `G = algebra([1],["e1"])`,
                `e1=G[1]`,
                `kg = uom("kilogram")`,
                `e1 * kg`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "e1*kg");
            engine.release();
        });
        it("(Uom, Vec)", function () {
            const lines: string[] = [
                `G = algebra([1],["e1"])`,
                `e1=G[1]`,
                `kg = uom("kilogram")`,
                `kg * e1`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "e1*kg");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(engine.renderAsInfix(actual), "m/s");
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
            const engine = create_script_context({
                dependencies: ['Flt', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "5.0*kg ** -1");
            engine.release();
        });
        it("/(Uom, Flt)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg / 5.0`
            ];
            const engine = create_script_context({
                dependencies: ['Flt', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* 0.2 kg)");
            assert.strictEqual(engine.renderAsInfix(actual), "0.2*kg");
            engine.release();
        });
        it("(Num, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `2 / kg`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "2*kg ** -1");
            engine.release();
        });
        it("(Uom, Num)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg / 2`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "1/2*kg");
            engine.release();
        });
    });
    describe("operator +", function () {
        it("(Uom, Uom)", function () {
            const lines: string[] = [
                `m = uom("meter")`,
                `m + m`
            ];
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "2*m");
            engine.release();
        });
        it("(Flt, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `6.0 + kg`
            ];
            const engine = create_script_context({
                catchExceptions: true,
                dependencies: ['Flt', 'Uom']
            });
            const { errors } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(errors[0].message, "6.0+kg");
            engine.release();
        });
        it("+(Uom, Flt)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg + 5.0`
            ];
            const engine = create_script_context({
                catchExceptions: true,
                dependencies: ['Flt', 'Uom']
            });
            const { errors } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(errors[0].message, "kg+5.0");
            engine.release();
        });
        it("(Rat, Uom)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `2 + kg`
            ];
            const engine = create_script_context({
                catchExceptions: true
            });
            const { errors } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(errors[0].message, "2+kg");
            engine.release();
        });
        it("(Uom, Rat)", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `kg + 2`
            ];
            const engine = create_script_context({
                catchExceptions: true,
                dependencies: ['Uom']
            });
            const { errors } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(errors[0].message, "kg+2");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(engine.renderAsInfix(actual), "N");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(engine.renderAsInfix(actual), "N");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(engine.renderAsInfix(actual), "N");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(actual)) {
                assert.strictEqual(engine.renderAsInfix(actual), "V");
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
            const engine = create_script_context({
                dependencies: ['Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            if (is_uom(value)) {
                assert.strictEqual(engine.renderAsInfix(value), "C");
            }
            else {
                assert.fail(`${JSON.stringify(value)}`);
            }
            engine.release();
        });
    });
    describe("functions", function () {
        it("abs(uom(kg))", function () {
            const lines: string[] = [
                `kg = uom("kilogram")`,
                `abs(kg)`
            ];
            const engine = create_script_context({
                dependencies: ['Flt', 'Uom']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "kg");
            engine.release();
        });
    });
    describe("dimensionless", function () {
        it("second", function () {
            const lines: string[] = [
                `second=uom("second")`,
                `second`
            ];
            const sourceText = lines.join('\n');
            const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.STEMCscript });
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 2);
            const values: U[] = [];
            for (const tree of trees) {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            assert.strictEqual(values.length, 1);
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "s");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "s");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "s");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "s");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "s");
            engine.release();
        });
        it("dimensionless Uom", function () {
            const lines: string[] = [
                `second=uom("second")`,
                `second/second`
            ];
            const sourceText = lines.join('\n');
            const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.STEMCscript });
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 2);
            const values: U[] = [];
            for (const tree of trees) {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            assert.strictEqual(values.length, 1);
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), "1");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), "1");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'LaTeX' }), "1");
            assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), "1");
            engine.release();
        });
        it("dimensionless Uom should be converted to Rat(1)", function () {
            const lines: string[] = [
                `second=uom("second")`,
                `second/second`
            ];
            const sourceText = lines.join('\n');
            const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.STEMCscript });
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 2);
            const values: U[] = [];
            for (const tree of trees) {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            assert.strictEqual(values.length, 1);
            assert.strictEqual(engine.renderAsString(values[0], { format: 'Infix' }), "1");
            assert.strictEqual(is_rat(values[0]), true);
            assert.strictEqual(is_uom(values[0]), false);
            engine.release();
        });
    });
});
