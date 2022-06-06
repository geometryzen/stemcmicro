import { assert } from 'chai';
import { create_engine, is_blade, is_tensor } from '../index';
import { assert_one_value_execute } from './assert_one_value_execute';

describe("operator +", function () {
    it("(e1, e1)", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b1`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
        engine.release();
    });
});

//
// These tests intentionally avoid the use of e1, e2, ... etc. as labels or symbols for blades.
// This is because the geocas library, upon which the Multivector is built, supplies lowecase e labels as defaults.
// The use of different labels and symbols ensures that everything is wired together correctly.
//
describe("algebra", function () {
    describe("constructor", function () {
        it("should return a valid tensor", function () {
            const lines: string[] = [
                `algebra([1, 1, 1], ["L1", "L2", "L3"])`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const $ = engine.$;
            const G30 = assert_one_value_execute(lines.join('\n'), engine);
            assert.isTrue(is_tensor(G30));
            if (is_tensor(G30)) {
                assert.strictEqual(G30.ndim, 1);
                assert.strictEqual(G30.dim(0), 3);
                const e1 = G30.elem(0);
                const e2 = G30.elem(1);
                const e3 = G30.elem(2);
                assert.isTrue(is_blade(e1), "e1");
                assert.isTrue(is_blade(e2), "e2");
                assert.isTrue(is_blade(e3), "e3");
                if (is_blade(e1)) {
                    assert.strictEqual(e1.toString(), "L1");
                }
                if (is_blade(e2)) {
                    // Ensure that the toInfixString works also.
                    assert.strictEqual($.toInfixString(e2), "L2");
                }
                if (is_blade(e3)) {
                    assert.strictEqual(e3.toString(), "L3");
                }
            }


            engine.release();
        });
    });
    describe("operator +", function () {
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = b1 + b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1+L2");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = b1 + b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1+L2");
            engine.release();
        });
        it("(e1, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = b1 + b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
            engine.release();
        });
    });
    describe("operator -", function () {
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = b1 - b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // geocas could probably make this more compact.
            assert.strictEqual($.toInfixString(actual), "L1-L2");


            engine.release();
        });
        it("(e1, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = b1 - b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator *", function () {
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = b1 * b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            // Interestingly, this seems to have simplified because e1 * e2 = e1 | e2 + e1 ^ e2 = e1 ^ e2 (orthogonal basis vectors).
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2");
            engine.release();
        });
        it("(2, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1], ["L1", "L2"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = 2 * b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
            engine.release();
        });
    });
    describe("operator *", function () {
        it("(e1, e2, e3)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 * b2 * b3`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2^L3");
            engine.release();
        });
    });
    describe("operator |", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 | b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 | b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator <<", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 << b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 << b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator >>", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 >> b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 >> b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator ^", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 ^ b1`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 ^ b2`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2");
            engine.release();
        });
        it("(e1, e2, e3)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `b3 = G11[3]`,
                `X = b1 ^ b2 ^ b3`,
                `X`
            ];
            const engine = create_engine({
                dependencies: ['Blade']
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2^L3");
            engine.release();
        });
    });
    // cross is defined using an inflexible definition that applies only to tensors.
    // curl and div will have the same problem.
    /*
    describe("cross", function () {
        it("(e1, e2)", function () {
            const lines: string[] = [
                `G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`,
                `b1 = G11[1]`,
                `b2 = G11[2]`,
                `X = cross(b1, b2)`,
                `X`
            ]
            const actual = run(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0], "Multivector(L3)");
        });
    });
    */
});
describe("algebra", function () {
    it("fixed", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 - b1`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(value), "0");
        engine.release();
    });
    it("broken?", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 - b2`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(value), "L1-L2");
        engine.release();
    });
    // But it works for symbols...
    it("a + (-1 * a)", function () {
        const lines: string[] = [
            `a + (-1 * a)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(value), "0");
        engine.release();
    });
    // And works for rationals
    it("5 + (-1 * 5)", function () {
        const lines: string[] = [
            `a = 5`,
            `a + (-1 * a)`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(value), "0");
        engine.release();
    });
    // And works for floats
    it("5.0 + (-1 * 5.0)", function () {
        const lines: string[] = [
            `a = 5.0`,
            `a + (-1 * a)`
        ];
        const engine = create_engine({
            dependencies: ['Flt']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(value), "0.0");
        engine.release();
    });
});
describe("algebra", function () {
    it("(e1, e2)", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b2`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual($.toInfixString(actual), "L1+L2");
        engine.release();
    });
    it("(e1, e2)", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b2`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "L1+L2");
        engine.release();
    });
    it("(e1, e1)", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b1`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
        engine.release();
    });
});
