import { assert } from "chai";
import { create_script_context } from "../index";
import { Directive } from "../src/env/ExtensionEnv";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("gibbs", function () {
    it("Scalar or Dot Product", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `A|B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("Vector or Cross Product", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bz*e1-Az*By*e1-Ax*Bz*e2+Az*Bx*e2+Ax*By*e3-Ay*Bx*e3");
        engine.release();
    });
    it("Magnitude of a Vector", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `abs(A)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
    it("Show how to find A, given u=A+B and v=A-B", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `u=A+B`,
            `v=A-B`,
            `(u+v)/2`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*e1+Ay*e2+Az*e3");
        engine.release();
    });
    it("Show how to find B, given u=A+B and v=A-B", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `u=A+B`,
            `v=A-B`,
            `(u-v)/2`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Bx*e1+By*e2+Bz*e3");
        engine.release();
    });
    it("A vector equation can be reduced to the form A = B. Show that this is equal to three scalar equations", function () {
        // It would be interesting to use one fact to derive others.
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `A|e1-B|e1`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax-Bx");
        engine.release();
    });
    it("Determining the magnitude of A x B: Part I", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `(A|B)**2-Ax*Ax*Bx*Bx-Ay*Ay*By*By-Az*Az*Bz*Bz-2*Ax*Ay*Bx*By-2*Ax*Az*Bx*Bz-2*Ay*Az*By*Bz`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            enable: [Directive.expandPowSum]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("Determining the magnitude of A x B", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
            `LHS=cross(A,B)|cross(A,B)`,
            `RHS=(A|A)*(B|B)-(A|B)**2`,
            `LHS-RHS`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            enable: [Directive.expandPowSum]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("Handling of Powers: Part I", function () {
        const lines: string[] = [
            `Ax**2*(By*By)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* (pow Ax 2) (pow By 2))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2*By**2");
        engine.release();
    });
    it("Handling of Powers: Part II", function () {
        const lines: string[] = [
            `Ax**2*(By*By)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2*By**2");
        engine.release();
    });
    it("Handling of Powers: Part III", function () {
        const lines: string[] = [
            `Ax**2*By*By`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2*By**2");
        engine.release();
    });
    it("cross(A,B)|cross(A,B)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
            `D=cross(A,B)`,
            `D|D`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-2*Ax*Ay*Bx*By-2*Ax*Az*Bx*Bz-2*Ay*Az*By*Bz+Ax**2*By**2+Ax**2*Bz**2+Ay**2*Bx**2+Ay**2*Bz**2+Az**2*Bx**2+Az**2*By**2");
        engine.release();
    });
    it("cross(A,B)|cross(A,B)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
            `cross(A,B)|cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-2*Ax*Ay*Bx*By-2*Ax*Az*Bx*Bz-2*Ay*Az*By*Bz+Ax**2*By**2+Ax**2*Bz**2+Ay**2*Bx**2+Ay**2*Bz**2+Az**2*Bx**2+Az**2*By**2");
        engine.release();
    });
    it("A|A", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
            `A|A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2+Ay**2+Az**2");
        engine.release();
    });
    it("A*A should be equal to A|A (Geometric Algebra)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1`,
            `A*A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(pow Ax 2)");
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2");
        engine.release();
    });
    it("A*A should be equal to A|A (Geometric Algebra)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1 + Ay * e2`,
            `A*A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (pow Ax 2) (pow Ay 2))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2+Ay**2");
        engine.release();
    });
    it("A*A should be equal to A|A (Geometric Algebra)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `A*A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
            disable: [Directive.factoring]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2+Ay**2+Az**2");
        engine.release();
    });
    it("(Ax*e1)*(By*e2)", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1`,
            `B = By * e2`,
            `A*B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* Ax By e1^e2)");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*By*e1^e2");
        engine.release();
    });
    describe("TRIPLE PRODUCTS", function () {
        it("A|(B x C) = B|(C x A)", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `LHS=A|cross(B,C)`,
                `RHS=B|cross(C,A)`,
                `LHS-RHS`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("A x (B x C) = B * A|C -C * A|B", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `LHS=cross(A, cross(B,C))`,
                `RHS=B* A|C - C * A|B`,
                `LHS-RHS`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
    });
    describe("PRODUCT RULES", function () {
        it("grad(f*g) = f*grad(g)-grad(f)*g", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `grad(f*g)-f*grad(g)-grad(f)*g`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("gradient of scalar product of two vectors", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `grad(A|B)-cross(A, curl(B))-cross(B,curl(A))-ddrv(B,A)-ddrv(A,B)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("divergence of scalar times vector", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `div(f*A)-f*div(A)-A|grad(f)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("divergence of Cross Product", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `div(cross(A,B))-B|curl(A)+A|curl(B)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("curl of scalar times vector", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `LHS=curl(f*A)`,
                `RHS=f*curl(A)-cross(A,grad(f))`,
                `LHS-RHS`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("curl of cross product: Part I", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
                `e1=G30[1]`,
                `e2=G30[2]`,
                `e3=G30[3]`,
                `Bz*e3*d(Az,z)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
                disable: [Directive.factoring]
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* Bz (derivative Az z) e3)");
            assert.strictEqual(engine.renderAsInfix(value), "Bz*d(Az,z)*e3");
            engine.release();
        });
        it("curl of cross product", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
                `e1=G30[1]`,
                `e2=G30[2]`,
                `e3=G30[3]`,
                `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
                `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
                `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
                `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
                `A = Ax * e1 + Ay * e2 + Az * e3`,
                `B = Bx * e1 + By * e2 + Bz * e3`,
                `LHS=curl(cross(A,B))`,
                `RHS=ddrv(A,B)-ddrv(B,A)+A*div(B)-B*div(A)`,
                `LHS-RHS`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
                disable: [Directive.factoring]
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
    });
    describe("SECOND DERIVATIVES", function () {
        it("div of curl of vector is zero", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
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
                `div(curl(A))`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
                disable: [Directive.factoring]
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("curl of grad of scalar is zero", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
                `e1=G30[1]`,
                `e2=G30[2]`,
                `e3=G30[3]`,
                `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
                `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
                `curl(grad(f))`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
        it("curl of curl of a vector", function () {
            const lines: string[] = [
                `G30=algebra([1,1,1],["e1","e2","e3"])`,
                `e1=G30[1]`,
                `e2=G30[2]`,
                `e3=G30[3]`,
                `A = Ax * e1 + Ay * e2 + Az * e3`,
                `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
                `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
                `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
                `laplacian(t) = d(d(t,x),x) + d(d(t,y),y) + d(d(t,z),z)`,
                `LHS=curl(curl(A))`,
                `RHS=grad(div(A))-laplacian(A)`,
                `LHS-RHS`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
    });
});
