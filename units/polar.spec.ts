import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("polar", function () {
    // TODO: polar should return the parts [r,theta] rather than being a formatting function.
    // We could rebuild z using a complex_from_polar function.
    xit("1+i", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1/2)`,
            `polar(1+i)`,
        ];
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "???");
        assert.strictEqual(engine.renderAsInfix(value), "2^(1/2)*exp(1/4*i*pi)");
        engine.release();
    });
});
