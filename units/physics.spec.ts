import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("physics", function () {
    describe("Rat*Blade*Uom", function () {
        it("C", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * 5 * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
    });
});

describe("physics", function () {
    describe("Sym*Blade*Uom", function () {
        it("A", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `a * i * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "a*i*kg");
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `a * kg * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "a*i*kg");
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * a * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "a*i*kg");
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * i * a`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "a*i*kg");
            engine.release();
        });
        it("E", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * kg * a`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "a*i*kg");
            engine.release();
        });
        it("F", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * a * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "a*i*kg");
            engine.release();
        });
    });
    describe("Rat*Blade*Uom", function () {
        it("A", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5 * i * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5 * kg * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * 5 * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * i * 5`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
        it("E", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * kg * 5`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
        it("F", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * 5 * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*i*kg");
            engine.release();
        });
    });
    describe("Flt*Blade*Uom", function () {
        it("A", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5.0 * i * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Flt', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5.0*i*kg");
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5.0 * kg * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Flt', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5.0*i*kg");
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * 5.0 * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Flt', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5.0*i*kg");
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * i * 5.0`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Flt', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5.0*i*kg");
            engine.release();
        });
        it("E", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * kg * 5.0`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Flt', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5.0*i*kg");
            engine.release();
        });
        it("F", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * 5.0 * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Flt', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5.0*i*kg");
            engine.release();
        });
    });
    describe("Num*Sym*Blade", function () {
        it("A", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `a * i * 5`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*i");
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `a * 5 * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*i");
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5 * a * i`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*i");
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5 * i * a`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*i");
            engine.release();
        });
        it("E", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * 5 * a`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*i");
            engine.release();
        });
        it("F", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `i * a * 5`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*i");
            engine.release();
        });
    });
    describe("Num*Sym*Uom", function () {
        it("A", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `a * 5 * kg`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*kg");
            engine.release();
        });
        it("B", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `a * kg * 5`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*kg");
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * a * 5`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*kg");
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `kg * 5 * a`
            ];
            const engine = createSymEngine({
                dependencies: ['Blade', 'Uom']
            });
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*kg");
            engine.release();
        });
        it("E", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5 * kg * a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*kg");
            engine.release();
        });
        it("F", function () {
            const lines: string[] = [
                `G = algebra([1,1,1],["i","j","k"])`,
                `i=G[1]`,
                `kg = uom("kilogram")`,
                `5 * a * kg`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_expr(value, $), "5*a*kg");
            engine.release();
        });
    });
});
