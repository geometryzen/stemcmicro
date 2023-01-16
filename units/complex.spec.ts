import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("complex", function () {
    it("C", function () {
        const lines: string[] = [
            `i*y+x`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+y*i");
        engine.release();
    });
});

describe("complex", function () {
    it("A", function () {
        const lines: string[] = [
            `x+i*y`,
        ];
        const engine = createScriptEngine({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `x+y*i`,
        ];
        const engine = createScriptEngine({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `i*y+x`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+y*i");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `y*i+x`,
        ];
        const engine = createScriptEngine({ useDefinitions: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+y*i");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `i*i`,
        ];
        const engine = createScriptEngine({ useDefinitions: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-1");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `(-i)*i`,
        ];
        const engine = createScriptEngine({ useDefinitions: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [
            `(-i)+i`,
        ];
        const engine = createScriptEngine({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("H", function () {
        const lines: string[] = [
            `i+(-i)`,
        ];
        const engine = createScriptEngine({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("I", function () {
        const lines: string[] = [
            `y*x*i*2*a`,
        ];
        const engine = createScriptEngine({ useDefinitions: true });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2*a*x*y*i");
        engine.release();
    });
    it("J", function () {
        // We're not using definitions in this test and so i is just any ordinaty symbol.
        const lines: string[] = [
            `y*x*i*2*a`,
        ];
        const engine = createScriptEngine({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2*a*i*x*y");
        engine.release();
    });
});
