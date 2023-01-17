import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("a*d(b,x)+a*d(b,y)", function () {
        const lines: string[] = [
            `a*d(b,x)+a*d(b,y)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a (+ (derivative b x) (derivative b y)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,x)+d(b,y))");
        engine.release();
    });
    it("a*(d(b,x)+d(b,y))", function () {
        const lines: string[] = [
            `a*(d(b,x)+d(b,y))`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a (+ (derivative b x) (derivative b y)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,x)+d(b,y))");
        engine.release();
    });
    it("d(b,y)+d(b,x)", function () {
        const lines: string[] = [
            `d(b,y)+d(b,x)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (derivative b x) (derivative b y))");
        assert.strictEqual(engine.renderAsInfix(value), "d(b,x)+d(b,y)");
        engine.release();
    });
    it("a*(d(b,y)+d(b,x))", function () {
        const lines: string[] = [
            `a*(d(b,y)+d(b,x))`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a (+ (derivative b x) (derivative b y)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,x)+d(b,y))");
        engine.release();
    });
});
