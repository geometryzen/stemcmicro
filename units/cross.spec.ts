import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("cross", function () {
    it("cross(A,cross(B,C))", function () {
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
        const engine = createScriptEngine({ dependencies: ['Blade'] });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // eslint-disable-next-line no-console
        // console.lg(`double cross elapsedTime = ${elapsedTime} ms`);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-i+j");
        engine.release();
    });
    it("k+j+i+k+j+i => 2*(i+j+k)", function () {
        const lines: string[] = [
            `implicate=1`,
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `k+j+i+k+j+i`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Factorization should group the terms based upon the blade.
        // TODO: Canonical ordering should order the terms by the vector.
        assert.strictEqual(engine.renderAsInfix(value), "2*(i+j+k)");
        engine.release();
    });
    it("cross(A,B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`cross(A,B) elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bz-Az*By)*i+(-Ax*Bz+Az*Bx)*j+(Ax*By-Ay*Bx)*k");
        engine.release();
    });
    it("cross(A,B)+cross(B,A)", function () {
        const lines: string[] = [
            `implicate=0`,
            `autofactor=0`,
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)+cross(B,A)`
        ];
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`A^B elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "(Ax*By-Ay*Bx)*i^j+(Ax*Bz-Az*Bx)*i^k+(Ay*Bz-Az*By)*j^k");
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    // SLOW
    it("cross(A,cross(B,C))", function () {
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
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");
        engine.release();
    });
    // SLOW
    it("cross(A,cross(B,C))-B*(A|C)+C*(A|B)", function () {
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
        const engine = createScriptEngine({
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
    it("cross(A,cross(B,C))-A|(B^C)", function () {
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
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    // SLOW
    it("cross(A,cross(B,C))", function () {
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
        const engine = createScriptEngine({ dependencies: ['Blade'] });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // eslint-disable-next-line no-console
        // console.lg(`double cross elapsedTime = ${elapsedTime} ms`);
        // assert.strictEqual($.toListString(value), "");
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");
        engine.release();
    });
    it("A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `A = i * Ax`,
            `A`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "Ax*i");
        engine.release();
    });
    it("cross(A,B)", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `j=G[2]`,
            `k=G[3]`,
            `A = i * Ax + j * Ay + k * Az`,
            `B = i * Bx + j * By + k * Bz`,
            `cross(A,B)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade']
        });
        // const startTime = new Date().getTime();
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // const elapsedTime = new Date().getTime() - startTime;
        // console.lg(`cross(A,B) elapsedTime = ${elapsedTime} ms`);
        // TODO: Factorization should group the terms based upon the blade.
        assert.strictEqual(engine.renderAsInfix(value), "(Ay*Bz-Az*By)*i+(-Ax*Bz+Az*Bx)*j+(Ax*By-Ay*Bx)*k");
        engine.release();
    });
});
