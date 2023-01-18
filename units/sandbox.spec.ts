import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("", function () {
        const lines: string[] = [
            `(Ax*By)**2`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* (power Ax 2) (power By 2))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2*By**2");
        engine.release();
    });
    it("", function () {
        const lines: string[] = [
            `Ax**2*By*By`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* (power Ax 2) (power By 2))");
        assert.strictEqual(engine.renderAsInfix(value), "Ax**2*By**2");
        engine.release();
    });
});
