import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("user", function () {
    it("f(x)=x", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `f(x,y)=2*x+y`,
            `f(1,2)`
        ];
        const engine = create_engine({
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(value, $), "4");
        assert.strictEqual(render_as_infix(value, $), "4");
        engine.release();
    });
    it("f(0,0)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `f(a,x)=1+sin(float(a/360*2*pi))-float(x)+sin(a/360*2*pi)-x`,
            `f(0,0)`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(value, $), "(+ (+ (+ 1 (sin 0.0)) 0.0) (sin 0))");
        assert.strictEqual(render_as_infix(value, $), "((1+sin(0.0))+0.0)+sin(0)");
        engine.release();
    });
});
