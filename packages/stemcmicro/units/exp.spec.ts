import assert from "assert";
import { Directive } from "../src/env/ExtensionEnv";
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("exp", function () {
    it("5", function () {
        const lines: string[] = [`exp(5)`];
        const engine = create_script_context();
        engine.executeScript("e=exp(1)");
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(pow e 5)");
        assert.strictEqual(engine.renderAsInfix(actual), "e**5");
        engine.release();
    });
    it("1", function () {
        const lines: string[] = [`e=exp(1)`, `exp(1)`];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "e");
        assert.strictEqual(engine.renderAsInfix(actual), "e");
        engine.release();
    });
    it("exp(i*pi)", function () {
        const lines: string[] = [`exp(i*pi)`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1");
        engine.release();
    });
    it("exp(pi*i)", function () {
        const lines: string[] = [`exp(pi*i)`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1");
        engine.release();
    });
    it("exp(i*x)", function () {
        const lines: string[] = [`exp(i*x)`];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)+i*sin(x)");
        engine.release();
    });
    it("exp(-i*x)", function () {
        const lines: string[] = [`exp(-i*x)`];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "cos(x)-i*sin(x)");
        engine.release();
    });
    it("exp(x*i)+exp(-x*i)", function () {
        const lines: string[] = [`exp(x*i)+exp(-x*i)`];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "2*cos(x)");
        engine.release();
    });
    it("exp(-x*i)+exp(x*i)", function () {
        const lines: string[] = [`exp(-x*i)+exp(x*i)`];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "2*cos(x)");
        engine.release();
    });
    it("exp(x*i)-exp(-x*i)", function () {
        const lines: string[] = [`exp(x*i)-exp(-x*i)`];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "2*i*sin(x)");
        engine.release();
    });
    it("exp(-x*i)-exp(x*i)", function () {
        const lines: string[] = [`exp(-x*i)-exp(x*i)`];
        const engine = create_script_context({
            enable: [Directive.convertExpToTrig],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-2*i*sin(x)");
        engine.release();
    });
    it("exp(-3/4*i*pi)", function () {
        const lines: string[] = [`exp(-3/4*i*pi)`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/2*2**(1/2)-1/2*2**(1/2)*i");
        engine.release();
    });
    it("exp(1/3*i*pi)", function () {
        const lines: string[] = [`i=sqrt(-1)`, `pi=tau(1)/2`, `exp(1/3*i*pi)`];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2+1/2*3**(1/2)*i");
        engine.release();
    });
});
