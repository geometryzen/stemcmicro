import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("user", function () {
    xit("f(x)=x", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `f(x,y)=2*x+y`,
            `f(1,2)`
        ];
        const engine = createSymEngine({
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "4");
        assert.strictEqual(print_expr(value, $), "4");
        engine.release();
    });
    it("f(0,0)", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `f(a,x)=1+sin(float(a/360*2*pi))-float(x)+sin(a/360*2*pi)-x`,
            `f(0,0)`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            useDefinitions: true
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(value, $), "(+ (+ (+ 1 (sin 0.0)) 0.0) (sin 0))");
        assert.strictEqual(print_expr(value, $), "((1+sin(0.0))+0.0)+sin(0)");
        engine.release();
    });
});
