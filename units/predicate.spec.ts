import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("predicate", function () {
    it("x==0", function () {
        const lines: string[] = [
            `x==0`
        ];
        const engine = create_script_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "false");
        assert.strictEqual(engine.renderAsInfix(value), 'false');
    });
    it("x>0", function () {
        const lines: string[] = [
            `x>0`
        ];
        const engine = create_script_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "true");
        assert.strictEqual(engine.renderAsInfix(value), 'true');
    });
    it("x<0", function () {
        const lines: string[] = [
            `x<0`
        ];
        const engine = create_script_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "false");
        assert.strictEqual(engine.renderAsInfix(value), 'false');
    });
    it("x * y < 0", function () {
        const lines: string[] = [
            `x * y < 0`
        ];
        const engine = create_script_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "false");
        assert.strictEqual(engine.renderAsInfix(value), 'false');
    });
    it("x * y > 0", function () {
        const lines: string[] = [
            `x * y > 0`
        ];
        const engine = create_script_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "true");
        assert.strictEqual(engine.renderAsInfix(value), 'true');
    });
});
