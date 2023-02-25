import { assert_one_value_execute } from "./assert_one_value_execute";
import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    it("A", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["e1","e2","e3"])`,
            `e1=G[1]`,
            `kg = uom("kilogram")`,
            `5.0 * e1 * kg`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Flt', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "5.0*e1*kg");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `kg = uom("kilogram")`,
            `5.0 * kg * i`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Flt', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "5.0*i*kg");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `kg = uom("kilogram")`,
            `kg * 5.0 * i`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Flt', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "5.0*i*kg");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `kg = uom("kilogram")`,
            `kg * i * 5.0`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Flt', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "5.0*i*kg");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `kg = uom("kilogram")`,
            `i * kg * 5.0`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Flt', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "5.0*i*kg");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `i=G[1]`,
            `kg = uom("kilogram")`,
            `i * 5.0 * kg`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Flt', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "5.0*i*kg");
        engine.release();
    });
});
