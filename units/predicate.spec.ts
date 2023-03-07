import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("predicate", function () {
    it("x==0", function () {
        const lines: string[] = [
            `x==0`
        ];
        const engine = create_script_context({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "#f");
        assert.strictEqual(engine.renderAsInfix(value), 'false');
    });
    it("x>0", function () {
        const lines: string[] = [
            `x>0`
        ];
        const engine = create_script_context({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "#t");
        assert.strictEqual(engine.renderAsInfix(value), 'true');
    });
    it("x<0", function () {
        const lines: string[] = [
            `x<0`
        ];
        const engine = create_script_context({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "#f");
        assert.strictEqual(engine.renderAsInfix(value), 'false');
    });
    it("x * y < 0", function () {
        const lines: string[] = [
            `x * y < 0`
        ];
        const engine = create_script_context({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "#f");
        assert.strictEqual(engine.renderAsInfix(value), 'false');
    });
    it("x * y > 0", function () {
        const lines: string[] = [
            `x * y > 0`
        ];
        const engine = create_script_context({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "#t");
        assert.strictEqual(engine.renderAsInfix(value), 'true');
    });
});
