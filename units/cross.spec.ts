import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cross", function () {
    it("Ax(BxC)", function () {
        // The vector-valued triple product with two cross products.
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
        const engine = create_script_context({ dependencies: ['Blade'] });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // eslint-disable-next-line no-console
        // console.lg(`double cross elapsedTime = ${elapsedTime} ms`);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bx*Cy*i-Ay*By*Cx*i+Az*Bx*Cz*i-Az*Bz*Cx*i-Ax*Bx*Cy*j+Ax*By*Cx*j+Az*By*Cz*j-Az*Bz*Cy*j-Ax*Bx*Cz*k+Ax*Bz*Cx*k-Ay*By*Cz*k+Ay*Bz*Cy*k");
        engine.release();
    });
});

describe("cross", function () {
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
        assert.strictEqual(engine.renderAsInfix(value), "Ax*i+Ay*j+Az*k");
        engine.release();
    });
    it("cross(i,i) = 0", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(i,i)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("cross(j,j) = 0", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(j,j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("cross(k,k) = 0", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(k,k)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("cross(i,j) = k", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(i,j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "k");
        engine.release();
    });
    it("cross(j,k) = i", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(j,k)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "i");
        engine.release();
    });
    it("cross(k,i) = j", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(k,i)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "j");
        engine.release();
    });
    it("cross(j,i) = -k", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(j,i)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-k");
        engine.release();
    });
    it("cross(k,j) = -i", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(k,j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-i");
        engine.release();
    });
    it("cross(i,k) = -j", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(i,k)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-j");
        engine.release();
    });
    it("cross(a*i,j) = a*k", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(a*i,j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*k");
        engine.release();
    });
    it("cross(i*a,j) = a*k", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(i*a,j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*k");
        engine.release();
    });
    it("cross(i,a*j) = a*k", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(i,a*j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a*k");
        engine.release();
    });
    it("cross(i+k,j) = 0", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(i+k,j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-i+k");
        engine.release();
    });
    it("cross(k, i+j) = 0", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `cross(k,i+j)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-i+j");
        engine.release();
    });
    it("k+j+i+k+j+i", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `k+j+i+k+j+i`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Factorization should group the terms based upon the blade.
        // TODO: Canonical ordering should order the terms by the vector.
        assert.strictEqual(engine.renderAsInfix(value), "2*i+2*j+2*k");
        engine.release();
    });
    it("AxB", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`cross(A,B) elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bz*i-Az*By*i-Ax*Bz*j+Az*Bx*j+Ax*By*k-Ay*Bx*k");
        engine.release();
    });
    it("cross(A,B)+cross(B,A)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)+cross(B,A)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`cross(A,B)+cross(B,A) elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("A^B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A^B`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`A^B elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "Ax*By*i^j-Ay*Bx*i^j+Ax*Bz*i^k-Az*Bx*i^k+Ay*Bz*j^k-Az*By*j^k");
        engine.release();
    });
    it("A^B+B^A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A^B+B^A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`A^B+B^A elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("A|B-B|A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `A|B-B|A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("Ax(BxC)", function () {
        // The vector-valued triple product with two cross products.
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
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bx*Cy*i-Ay*By*Cx*i+Az*Bx*Cz*i-Az*Bz*Cx*i-Ax*Bx*Cy*j+Ax*By*Cx*j+Az*By*Cz*j-Az*Bz*Cy*j-Ax*Bx*Cz*k+Ax*Bz*Cx*k-Ay*By*Cz*k+Ay*Bz*Cy*k");
        engine.release();
    });
    it("Ax(BxC)-B*(A|C)+C*(A|B)", function () {
        // The vector-valued triple product with two cross products.
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))-B*(A|C)+C*(A|B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("I * (e1 ^ e2)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `I = e1 * e2 * e3`,
            `I * (e1 ^ e2)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "-k");
        engine.release();
    });
    it("cross(A,B) = -I * (A^B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `I = e1 * e2 * e3`,
            `cross(A,B)+I*(A^B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // eslint-disable-next-line no-console
        // console.lg(`cross(A,B)-I*(A^B) elapsedTime = ${elapsedTime} ms`);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    // SLOW
    it("Ax(BxC)-A|(B^C)", function () {
        // FIXME:
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))+(A*(B^C)-(B^C)*A)/2`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("Ax(BxC)", function () {
        // The vector-valued triple product with two cross products.
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
        const engine = create_script_context({ dependencies: ['Blade'] });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // eslint-disable-next-line no-console
        // console.lg(`double cross elapsedTime = ${elapsedTime} ms`);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bx*Cy*i-Ay*By*Cx*i+Az*Bx*Cz*i-Az*Bz*Cx*i-Ax*Bx*Cy*j+Ax*By*Cx*j+Az*By*Cz*j-Az*Bz*Cy*j-Ax*Bx*Cz*k+Ax*Bz*Cx*k-Ay*By*Cz*k+Ay*Bz*Cy*k");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `A = i * Ax`,
            `A`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*i");
        engine.release();
    });
    it("AxB", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`cross(A,B) elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bz*i-Az*By*i-Ax*Bz*j+Az*Bx*j+Ax*By*k-Ay*Bx*k");
        engine.release();
    });
    it("AxB with general metric", function () {
        const lines: string[] = [
            `G = algebra([g11,g12,g13],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const engine = create_script_context({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ay*Bz*g12*g13*i-Az*By*g12*g13*i-Ax*Bz*g11*g13*j+Az*Bx*g11*g13*j+Ax*By*g11*g12*k-Ay*Bx*g11*g12*k");
        engine.release();
    });
});
