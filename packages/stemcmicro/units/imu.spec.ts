import assert from "assert";
import { stemc_prolog } from "../src/runtime/init";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("imu", function () {
    it("i squared should be -1", function () {
        const lines: string[] = [`i * i`];
        const engine = create_script_context({
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "-1");
        assert.strictEqual(engine.renderAsInfix(actual), "-1");

        engine.release();
    });
    it("Rat * Imu * Sym * Cons", function () {
        const lines: string[] = [`G30=algebra([1,1,1],["e1","e2","e3"])`, `e1=G30[1]`, `e2=G30[2]`, `e3=G30[3]`, `kg=uom("kilogram")`, `2*i*x*"hello"*sin(x)*e1*kg`];
        const engine = create_script_context({
            dependencies: ["Blade", "Flt", "Imu", "Uom", "Vector"],
            prolog: stemc_prolog
        });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        // assert.strictEqual(engine.renderAsSExpr(actual), "(* 2 i x)");
        assert.strictEqual(engine.renderAsInfix(actual), `2*i*x*sin(x)*e1*"hello"*kg`);

        engine.release();
    });
});
