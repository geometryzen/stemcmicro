import assert from "assert";
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("complex", function () {
    it("C", function () {
        const lines: string[] = [`y*i+x`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        engine.executeScript("i=sqrt(-1)");
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
});

describe("complex", function () {
    it("A", function () {
        const lines: string[] = [`x+i*y`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [`x+y*i`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [`i*y+x`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [`y*i+x`];
        const engine = create_script_context({ prolog: stemc_prolog });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [`i*i`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "-1");
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [`(-i)*i`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [`(-i)+i`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("H", function () {
        const lines: string[] = [`i+(-i)`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("I", function () {
        const lines: string[] = [`y*x*k*j*i*a*2`];
        const engine = create_script_context({});
        engine.executeScript("i=sqrt(-1)");
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2*i*a*j*k*x*y");
        engine.release();
    });
    it("J", function () {
        // We're not using definitions in this test and so i is just any ordinaty symbol.
        const lines: string[] = [`y*x*k*j*i*2*a`];
        const engine = create_script_context({});
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "2*a*i*j*k*x*y");
        engine.release();
    });
    it("K", function () {
        const lines: string[] = [`y*i+x`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        engine.executeScript("i=sqrt(-1)");
        const value = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(value), "x+i*y");
        engine.release();
    });
    it("L", function () {
        const lines: string[] = [`complex(0,0)`];
        const sourceText = lines.join("\n");
        const engine = create_script_context({});
        const value = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(value), "0");
        engine.release();
    });
    it("M", function () {
        const lines: string[] = [`complex(1,0)`];
        const sourceText = lines.join("\n");
        const engine = create_script_context({});
        const value = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("N", function () {
        const lines: string[] = [`complex(0,1)`];
        const sourceText = lines.join("\n");
        const engine = create_script_context({});
        const value = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(value), "i");
        engine.release();
    });
});
