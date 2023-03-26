
import { assert } from "chai";
import { create_script_context } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("re((a**2)**(1/2))", function () {
        const lines: string[] = [
            `re((a**2)**(1/2))`
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(a**2)**(1/2)");
        engine.release();
    });
    it("im((a**2)**(1/2))", function () {
        const lines: string[] = [
            `im((a**2)**(1/2))`
        ];
        const engine = create_script_context({
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("arg(abs(a)*exp(b+i*pi/5))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `arg(abs(a)*exp(b+i*pi/5))`,
        ];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1/5*pi");
        engine.release();
    });
});