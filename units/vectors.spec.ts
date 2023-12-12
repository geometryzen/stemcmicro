import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("vectors", function () {
    it("A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax i) (* Ay j) (* Az k))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*i+Ay*j+Az*k");
        engine.release();
    });
    it("abs(A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `abs(A)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(pow (+ (pow Ax 2) (pow Ay 2) (pow Az 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
    it("A|B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A|B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("A<<B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A<<B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("A>>B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A>>B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("B*(A|C)-C*(A|B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `B*(A|C)-C*(A|B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bx*Cy*i-Ay*By*Cx*i+Az*Bx*Cz*i-Az*Bz*Cx*i-Ax*Bx*Cy*j+Ax*By*Cx*j+Az*By*Cz*j-Az*Bz*Cy*j-Ax*Bx*Cz*k+Ax*Bz*Cx*k-Ay*By*Cz*k+Ay*Bz*Cy*k");
        engine.release();
    });
    it("Ax(BxC)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bx*Cy*i-Ay*By*Cx*i+Az*Bx*Cz*i-Az*Bz*Cx*i-Ax*Bx*Cy*j+Ax*By*Cx*j+Az*By*Cz*j-Az*Bz*Cy*j-Ax*Bx*Cz*k+Ax*Bz*Cx*k-Ay*By*Cz*k+Ay*Bz*Cy*k");

        engine.release();
    });
    it("Ax(BxC) = B*(A|C)-C*(A|B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))-B*A|C+C*A|B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("A|cross(B,C) ", function () {
        // The scalar-valued triple product.
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `A|cross(B,C)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*By*Cz-Ax*Bz*Cy-Ay*Bx*Cz+Ay*Bz*Cx+Az*Bx*Cy-Az*By*Cx");
        engine.release();
    });
    it("B|cross(C,A) ", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `A|cross(B,C)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*By*Cz-Ax*Bz*Cy-Ay*Bx*Cz+Ay*Bz*Cx+Az*Bx*Cy-Az*By*Cx");
        engine.release();
    });
    it("A|cross(B,C)-B|cross(C,A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `A|cross(B,C)-B|cross(C,A)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("abs(A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `abs(A)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(pow (+ (pow Ax 2) (pow Ay 2) (pow Az 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
    it("Scalar,Blade ordering", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay`,
            `B = i * Bx + j * By`,
            `A*B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*Bx+Ay*By+Ax*By*i^j-Ay*Bx*i^j");
        engine.release();
    });
});

describe("vectors", function () {
    describe("indentities", function () {
        it("e1|e1", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `e1|e1`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "1");
            assert.strictEqual(engine.renderAsInfix(value), "1");
            engine.release();
        });
        it("a*e1|e1", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `a*e1|e1`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "a");
            assert.strictEqual(engine.renderAsInfix(value), "a");
            engine.release();
        });
        it("a*b*e1|e1", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `a*b*e1|e1`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* a b)");
            assert.strictEqual(engine.renderAsInfix(value), "a*b");
            engine.release();
        });
        it("cross(A,B)|e1", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `A = a * e2`,
                `B = b * e3`,
                `cross(A,B)|e1`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* a b)");
            assert.strictEqual(engine.renderAsInfix(value), "a*b");
            engine.release();
        });
        it("e1|cross(A,B)", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `A = a * e2`,
                `B = b * e3`,
                `e1|cross(A,B)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* a b)");
            assert.strictEqual(engine.renderAsInfix(value), "a*b");
            engine.release();
        });
        xit("d(e1|cross(A,B),x)", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `A = a * e2`,
                `B = b * e3`,
                `d(e1|cross(A,B),x)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(+ (* a (derivative b x)) (* b (derivative a x)))");
            assert.strictEqual(engine.renderAsInfix(value), "a*d(b,x)+b*d(a,x)");
            engine.release();
        });
        xit("d(cross(A,B)|e1,x)", function () {
            const lines: string[] = [
                `G30 = algebra([1,1,1],["e1","e2","e3"])`,
                `e1 = G30[1]`,
                `e2 = G30[2]`,
                `e3 = G30[3]`,
                `A = a * e2`,
                `B = b * e3`,
                `d(cross(A,B)|e1,x)`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(+ (* a (derivative b x)) (* b (derivative a x)))");
            assert.strictEqual(engine.renderAsInfix(value), "a*d(b,x)+b*d(a,x)");
            engine.release();
        });
    });
});
