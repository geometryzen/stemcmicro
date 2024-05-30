import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

xdescribe("rect", function () {
    it("rect(a)", function () {
        const lines: string[] = [`rect(a)`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "a");
        engine.release();
    });
    it("rect(1)", function () {
        const lines: string[] = [`rect(1)`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("rect(1.0)", function () {
        const lines: string[] = [`rect(1.0)`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1.0");
        engine.release();
    });
    it("rect(exp(a))", function () {
        const lines: string[] = [`rect(exp(a))`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "exp(a)");
        engine.release();
    });
    it("rect(1/(x+i*y))", function () {
        const lines: string[] = [`i=sqrt(-1)`, `rect(1/(x+i*y))`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x/(x**2+y**2)-i*y/(x**2+y**2)");
        engine.release();
    });
    it("rect(exp(i*pi/3))", function () {
        const lines: string[] = [`i=sqrt(-1)`, `pi=tau(1/2)`, `rect(exp(i*pi/3))`];
        const engine = create_script_context({
            dependencies: ["Imu"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/2+1/2*3**(1/2)*i");
        engine.release();
    });
    it("rect(5*exp(i*arctan(4/3)))", function () {
        const lines: string[] = [`i=sqrt(-1)`, `pi=tau(1/2)`, `e=exp(1)`, `rect(5*exp(i*arctan(4/3)))`];
        const engine = create_script_context({
            dependencies: ["Imu"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "3+4*i");
        engine.release();
    });
    it("rect(polar(3+4*i))", function () {
        const lines: string[] = [`i=sqrt(-1)`, `pi=tau(1/2)`, `e=exp(1)`, `rect(polar(3+4*i))`];
        const engine = create_script_context({
            dependencies: ["Imu"]
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "3+4*i");
        engine.release();
    });
    it("rect(polar((-1)^(a)))", function () {
        const lines: string[] = [`rect(polar((-1)^(a)))`];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(pi*a)+i*sin(pi*a)");
        engine.release();
    });
});
