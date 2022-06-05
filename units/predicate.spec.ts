import { assert } from "chai";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("predicate", function () {
    it("x==0", function () {
        const lines: string[] = [
            `x==0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "false");
        assert.strictEqual(engine.renderAsInfix(value), 'False');
    });
    it("x>0", function () {
        const lines: string[] = [
            `x>0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "true");
        assert.strictEqual(engine.renderAsInfix(value), 'True');
    });
    it("x<0", function () {
        const lines: string[] = [
            `x<0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "false");
        assert.strictEqual(engine.renderAsInfix(value), 'False');
    });
    it("x * y < 0", function () {
        const lines: string[] = [
            `x * y < 0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "false");
        assert.strictEqual(engine.renderAsInfix(value), 'False');
    });
    it("x * y > 0", function () {
        const lines: string[] = [
            `x * y > 0`
        ];
        const engine = create_engine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Why the different capitalization?
        assert.strictEqual(engine.renderAsSExpr(value), "true");
        assert.strictEqual(engine.renderAsInfix(value), 'True');
    });
});
