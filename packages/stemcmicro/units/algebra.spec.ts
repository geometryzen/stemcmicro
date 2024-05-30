import assert from "assert";
import { is_blade, is_tensor } from "@stemcmicro/atoms";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs(blade)", function () {
    it("(e1, e1)", function () {
        const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `abs(b1)`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "1");
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
            const lines: string[] = [`algebra([1, 1, 1], ["L1", "L2", "L3"])`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const G30 = assert_one_value_execute(lines.join("\n"), engine);
            assert.strictEqual(is_tensor(G30), true);
            if (is_tensor(G30)) {
                assert.strictEqual(G30.ndim, 1);
                assert.strictEqual(G30.dim(0), 3);
                const e1 = G30.elem(0);
                const e2 = G30.elem(1);
                const e3 = G30.elem(2);
                assert.strictEqual(is_blade(e1), true);
                assert.strictEqual(is_blade(e2), true);
                assert.strictEqual(is_blade(e3), true);
                if (is_blade(e1)) {
                    assert.strictEqual(e1.toString(), "L1");
                }
                if (is_blade(e2)) {
                    // Ensure that the toInfixString works also.
                    assert.strictEqual(engine.renderAsInfix(e2), "L2");
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
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 + b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1+L2");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 + b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1+L2");
            engine.release();
        });
        it("(e1, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 + b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
            engine.release();
        });
    });
    describe("operator -", function () {
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 - b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const actual = assert_one_value_execute(lines.join("\n"), engine);
            // geocas could probably make this more compact.
            assert.strictEqual(engine.renderAsInfix(actual), "L1-L2");

            engine.release();
        });
        it("(e1, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 - b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator *", function () {
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 * b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            // Interestingly, this seems to have simplified because e1 * e2 = e1 | e2 + e1 ^ e2 = e1 ^ e2 (orthogonal basis vectors).
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2");
            engine.release();
        });
        it("(2, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = 2 * b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
            engine.release();
        });
    });
    describe("operator *", function () {
        it("(e1, e2, e3)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 * b2 * b3`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2^L3");
            engine.release();
        });
    });
    describe("operator |", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 | b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 | b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator <<", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 << b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 << b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator >>", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 >> b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "1");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 >> b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
    });
    describe("operator ^", function () {
        it("(e1, e1)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 ^ b1`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "0");
            engine.release();
        });
        it("(e1, e2)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 ^ b2`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
            assert.strictEqual(engine.renderAsInfix(values[0]), "L1^L2");
            assert.strictEqual(engine.renderAsLaTeX(values[0]), "L1 \\wedge L2");
            engine.release();
        });
        it("(e1, e2, e3)", function () {
            const lines: string[] = [`G11 = algebra([1, 1, 1], ["L1", "L2", "L3"])`, `b1 = G11[1]`, `b2 = G11[2]`, `b3 = G11[3]`, `X = b1 ^ b2 ^ b3`, `X`];
            const engine = create_script_context({
                dependencies: ["Blade"]
            });
            const { values } = engine.executeScript(lines.join("\n"));
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
        const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 - b1`, `X`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("broken?", function () {
        const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 - b2`, `X`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "L1-L2");
        engine.release();
    });
    // But it works for symbols...
    it("a + (-1 * a)", function () {
        const lines: string[] = [`a + (-1 * a)`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    // And works for rationals
    it("5 + (-1 * 5)", function () {
        const lines: string[] = [`a = 5`, `a + (-1 * a)`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    // And works for floats
    it("5.0 + (-1 * 5.0)", function () {
        const lines: string[] = [`a = 5.0`, `a + (-1 * a)`];
        const engine = create_script_context({
            dependencies: ["Flt"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0.0");
        engine.release();
    });
});
describe("algebra", function () {
    it("(e1, e2)", function () {
        const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 + b2`, `X`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "L1+L2");
        engine.release();
    });
    it("(e1, e2)", function () {
        const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 + b2`, `X`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "L1+L2");
        engine.release();
    });
    it("(e1, e1)", function () {
        const lines: string[] = [`G11 = algebra([1, 1], ["L1", "L2"])`, `b1 = G11[1]`, `b2 = G11[2]`, `X = b1 + b1`, `X`];
        const engine = create_script_context({
            dependencies: ["Blade"]
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "2*L1");
        engine.release();
    });
});
describe("metric", function () {
    xit("Vector or Cross Product", function () {
        const lines: string[] = [
            `G30=algebra([1.0,1.0,1.0],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `C = Cx * e1 + Cy * e2 + Cz * e3`,
            `cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ["Blade", "Vector", "Flt", "Imu", "Uom"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bz-Az*By)*e1+(-Ax*Bz+Az*Bx)*e2+(Ax*By-Ay*Bx)*e3");
        engine.release();
    });
});
