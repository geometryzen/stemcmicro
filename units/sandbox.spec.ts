import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("sandbox", function () {
    xit("cos(-x*y)", function () {
        const lines: string[] = [
            `-1*(-1*(x*y))`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(* x y)');
        assert.strictEqual(engine.renderAsInfix(value), 'x*y');
    });
    it("cos(-x*y)", function () {
        const lines: string[] = [
            `cos(-x*y)`
        ];
        const engine = createScriptEngine({
            dependencies: []
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(value), '(cos (* x y))');
        assert.strictEqual(engine.renderAsInfix(value), 'cos(x*y)');
    });
});
