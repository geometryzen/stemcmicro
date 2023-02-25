import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sin", function () {
    it("sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b) without factoring", function () {
        const lines: string[] = [
            `sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), '0');
    });
});

describe("sin", function () {
    it("sin(x)", function () {
        const lines: string[] = [
            `sin(x)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(sin x)');
        assert.strictEqual(engine.renderAsInfix(value), 'sin(x)');
    });
    it("sin(-x)", function () {
        const lines: string[] = [
            `sin(-x)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* -1 (sin x))");
        assert.strictEqual(engine.renderAsInfix(value), '-sin(x)');
    });
    it("sin(-x*y)", function () {
        const lines: string[] = [
            `sin(-x*y)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(* -1 (sin (* x y)))');
        assert.strictEqual(engine.renderAsInfix(value), '-sin(x*y)');
    });
    it("sin(-x*y*z)", function () {
        const lines: string[] = [
            `sin(-x*y*z)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(* -1 (sin (* x y z)))');
        assert.strictEqual(engine.renderAsInfix(value), '-sin(x*y*z)');
    });
    it("sin(a+b)", function () {
        const lines: string[] = [
            `sin(a+b)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*sin(b)+cos(b)*sin(a)');
    });
    it("sin(a-b)", function () {
        const lines: string[] = [
            `sin(a-b)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), '-cos(a)*sin(b)+cos(b)*sin(a)');
    });
    it("sin(b+a)", function () {
        const lines: string[] = [
            `sin(b+a)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*sin(b)+cos(b)*sin(a)');
    });
    it("sin(b-a)", function () {
        const lines: string[] = [
            `sin(b-a)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*sin(b)-cos(b)*sin(a)');
    });
    it("sin(b)*cos(a)-cos(b)*sin(a)", function () {
        // This test demonstrates that a canonical ordering of the sin, cos, and -1
        // parts of the previous expanded expression would lead to factorization.
        const lines: string[] = [
            `sin(b)*cos(a)-cos(b)*sin(a)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), 'cos(a)*sin(b)-cos(b)*sin(a)');
    });
    it("sin(a+b)-(sin(a)*cos(b)+cos(a)*sin(b))", function () {
        const lines: string[] = [
            `sin(a+b)-(sin(a)*cos(b)+cos(a)*sin(b))`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), '0');
    });
    it("sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b) without factoring", function () {
        const lines: string[] = [
            `sin(a)*cos(b)+cos(a)*sin(b)-sin(a+b)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), '0');
    });
    it("cos(b)*sin(a)+cos(a)*sin(b)-sin(a+b)", function () {
        const lines: string[] = [
            `cos(b)*sin(a)+cos(a)*sin(b)-sin(a+b)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), '0');
    });
});
