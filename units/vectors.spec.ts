import { assert } from "chai";
import { PHASE_EXPLICATE } from "../src/env/ExtensionEnv";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("vectors", function () {
    it("A x (B x C)", function () {
        //
        // Looping?
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");

        engine.release();
    });
    it("B * (A|C) - C * (A|B)", function () {
        //
        // Looping?
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");
        engine.release();
    });
    xit("cross(A,cross(B,C))", function () {
        // The vector-valued triple product with two cross products.
        // Looping?
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "0");
        engine.release();
    });
    xit("A|cross(B,C)-B|cross(C,A)", function () {
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "0");
        engine.release();
    });
    xit("A|cross(B,C) ", function () {
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "Ax*By*Cz-Ax*Bz*Cy-Ay*Bx*Cz+Ay*Bz*Cx+Az*Bx*Cy-Az*By*Cx");
        engine.release();
    });
    xit("B|cross(C,A) ", function () {
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "Ax*By*Cz-Ax*Bz*Cy-Ay*Bx*Cz+Ay*Bz*Cx+Az*Bx*Cy-Az*By*Cx");
        engine.release();
    });
});

describe("vectors", function () {
    it("abs(A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `abs(A)`
        ];
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(power (+ (power Ax 2) (power Ay 2) (power Az 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "(Ax**2+Ay**2+Az**2)**(1/2)");
        engine.release();
    });
    describe("Geometric Algebra with Symbols", function () {
        it("The geometric product is associative (ab)c = abc", function () {
            const lines: string[] = [
                `(a*b)*c`
            ];
            const engine = createSymEngine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'b', 'c']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), "(* a b c)");
            assert.strictEqual(print_expr(value, $), "a*b*c");
            engine.release();
        });
        it("The geometric product is associative a(bc) = abc", function () {
            // What happens here is that bc => b|c + (b^c).
            // Canonicalization rewrites a*(b|c) to (b|c)*a
            // We are left with (+ (* (| b c) a) (* a (^ b c))).
            // Several strategies could be used to achieve factoring back to (* a b c)
            const lines: string[] = [
                `a*(b*c)`
            ];
            const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), "(* a b c)");
            assert.strictEqual(print_expr(value, $), "a*b*c");
            engine.release();
        });
        it("abs(a)", function () {
            const lines: string[] = [
                `abs(a)`
            ];
            const engine = createSymEngine({ treatAsVectors: ['a', 'n'] });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), "(power (power a 2) 1/2)");
            assert.strictEqual(print_expr(value, $), "(a**2)**(1/2)");
            engine.release();
        });
        it("Reflections Zero", function () {
            const lines: string[] = [
                `autofactor=1`,
                `implicate=1`,
                `(a*n)*n - 2*(a|n)*n`,
            ];
            const engine = createSymEngine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), "(* -1 n a n)");
            assert.strictEqual(print_expr(value, $), "-n*a*n");
            engine.release();
        });
        it("Reflections I", function () {
            const lines: string[] = [
                `implicate=0`,
                `(a*n)*n - 2*(a|n)*n + n * a * n`,
            ];
            const engine = createSymEngine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), "0");
            assert.strictEqual(print_expr(value, $), "0");
            engine.release();
        });
        xit("Reflections II", function () {
            // By moving the parentheses to the right in a * n * n, we throw off the simplification.
            // We can't really stop the nested expression (* n n) from becoming (power n 2), but we
            // could recognize that a * n**2 can be put in a more left-association form.
            const lines: string[] = [
                `autofactor=0`,
                `implicate=0`,
                `a*(n*n) - 2*(a|n)*n + n * a * n`,
            ];
            const engine = createSymEngine({ treatAsVectors: ['a', 'n'] });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(value, $), "0");
            assert.strictEqual(print_expr(value, $), "0");
            engine.release();
        });
        it("Reflections Redux", function () {
            const lines: string[] = [
                `implicate=1`,
                `a*n - 2*(a|n)`,
            ];
            const engine = createSymEngine({
                dependencies: ['Vector'],
                treatAsVectors: ['a', 'n']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(value,$), "0");
            assert.strictEqual(print_expr(value, $), "-n*a");
            engine.release();
        });
        xit("a dot (b^c) => (a|b)*c - (a|c)*b", function () {
            const lines: string[] = [
                `autoexpand=1`,
                `autofactor=0`,
                `1/2*(a*(b^c)-(b^c)*a)`,
            ];
            const engine = createSymEngine({ treatAsVectors: ['a', 'b', 'c'] });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(value,$), "(* (| n n) a)");
            assert.strictEqual(print_expr(value, $), "a|b*c-a|c*b");
            engine.release();
        });
    });
});

describe("vectors", function () {
    it("x*y", function () {
        const lines: string[] = [
            `x*y`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x*y");
        engine.release();
    });
    it("x|y", function () {
        const lines: string[] = [
            `x|y`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x|y");
        engine.release();
    });
    it("y|x", function () {
        const lines: string[] = [
            `y|x`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x|y");
        engine.release();
    });
    it("x^y", function () {
        const lines: string[] = [
            `x^y`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x^y");
        engine.release();
    });
    it("y^x", function () {
        const lines: string[] = [
            `y^x`,
        ];
        const engine = createSymEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['x', 'y']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "-x^y");
        engine.release();
    });
    it("", function () {
        const lines: string[] = [
            `x|y+x^y`,
        ];
        const engine = createSymEngine({ treatAsVectors: ['x', 'y'] });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(value, $), "x*y");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `A`
        ];
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (* Ax i) (* Ay j) (* Az k))");
        assert.strictEqual(print_expr(value, $), "Ax*i+Ay*j+Az*k");
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(power (+ (power Ax 2) (power Ay 2) (power Az 2)) 1/2)");
        assert.strictEqual(print_expr(value, $), "(Ax**2+Ay**2+Az**2)**(1/2)");
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(print_expr(value, $), "Ax*Bx+Ay*By+Az*Bz");
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(print_expr(value, $), "Ax*Bx+Ay*By+Az*Bz");
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (* Ax Bx) (* Ay By) (* Az Bz))");
        assert.strictEqual(print_expr(value, $), "Ax*Bx+Ay*By+Az*Bz");
        engine.release();
    });
    it("A x (B x C) = B * (A|C) - C * (A|B)", function () {
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
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "0");
        engine.release();
    });
});
