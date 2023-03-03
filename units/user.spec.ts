import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("user", function () {
    it("f(x)=x", function () {
        const lines: string[] = [
            `f(x,y)=2*x+y`,
            `f(1,2)`
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "4");
        assert.strictEqual(engine.renderAsInfix(value), "4");
        engine.release();
    });
    it("f(0,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+sin(float(a/360*2*pi))-float(x)+sin(a/360*2*pi)-x`,
            `f(0,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("f(0,0)", function () {
        const lines: string[] = [
            `f(a,x)=1+tan(float(a/360*2*pi))-float(x)+tan(a/360*2*pi)-x`,
            `f(0,0)`
        ];
        const engine = create_script_context({
            dependencies: ['Flt'],
            useDefinitions: true
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
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1.0");
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
});
