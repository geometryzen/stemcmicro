import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    it("e1|e1", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `e1|e1`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "1");
        assert.strictEqual(engine.renderAsInfix(value), "1");
        engine.release();
    });
    it("a*e1|e1", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `a*e1|e1`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "a");
        assert.strictEqual(engine.renderAsInfix(value), "a");
        engine.release();
    });
    it("a*b*e1|e1", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `a*b*e1|e1`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a b)");
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
    it("cross(A,B)|e1", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `A = a * e2`,
            `B = b * e3`,
            `cross(A,B)|e1`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a b)");
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
    it("e1|cross(A,B)", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `A = a * e2`,
            `B = b * e3`,
            `e1|cross(A,B)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(* a b)");
        assert.strictEqual(engine.renderAsInfix(value), "a*b");
        engine.release();
    });
    it("d(e1|cross(A,B),x)", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `A = a * e2`,
            `B = b * e3`,
            `d(e1|cross(A,B),x)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* a (derivative b x)) (* b (derivative a x)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*d(b,x)+b*d(a,x)");
        engine.release();
    });
    it("d(cross(A,B)|e1,x)", function () {
        const lines: string[] = [
            `G30 = algebra([1,1,1],["e1","e2","e3"])`,
            `e1 = G30[1]`,
            `e2 = G30[2]`,
            `e3 = G30[3]`,
            `A = a * e2`,
            `B = b * e3`,
            `d(cross(A,B)|e1,x)`
        ];
        const engine = createScriptEngine({
            dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), "(+ (* a (derivative b x)) (* b (derivative a x)))");
        assert.strictEqual(engine.renderAsInfix(value), "a*d(b,x)+b*d(a,x)");
        engine.release();
    });
});
