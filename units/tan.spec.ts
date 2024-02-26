import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("tan", function () {
    it("tan(x)", function () {
        const lines: string[] = [
            `tan(x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(tan x)");
        assert.strictEqual(engine.renderAsInfix(actual), "tan(x)");

        engine.release();
    });
    it("tan(-x)", function () {
        const lines: string[] = [
            `tan(-x)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* -1 (tan x))");
        assert.strictEqual(engine.renderAsInfix(actual), "-tan(x)");

        engine.release();
    });
    it("tan(b-a)", function () {
        const lines: string[] = [
            `tan(b-a)`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-tan(a-b)");

        engine.release();
    });
    it("f(0,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(0,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            prolog: [
                `pi=tau(1/2)`
            ]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("f(180,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(180,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            prolog: [
                `pi=tau(1/2)`
            ]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("f(-180,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(-180,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            prolog: [
                `pi=tau(1/2)`
            ]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("f(360,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(360,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            prolog: [
                `pi=tau(1/2)`
            ]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("f(-360,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(-360,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            prolog: [
                `pi=tau(1/2)`
            ]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("f(135,-1)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(135,-1)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            prolog: [
                `pi=tau(1/2)`
            ]
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // this should really be 1.0 , however
        // we have errors doing the calculations so
        // we don't get to that exact 1.0 float
        assert.strictEqual(engine.renderAsSExpr(value), "1.000000...");
        assert.strictEqual(engine.renderAsInfix(value), "1.000000...");
        engine.release();
    });
});
