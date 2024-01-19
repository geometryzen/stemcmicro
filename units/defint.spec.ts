import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("defint", function () {
    it("A", function () {
        const lines: string[] = [
            `defint(x^2,y,0,sqrt(1-x^2),x,-1,1)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 1/8 pi)");
        assert.strictEqual(engine.renderAsInfix(actual), "1/8*pi");
        engine.release();
    });
    // TODO: Need a way to define cross(Tensor,Tensor) that does not mask the blade overload.
    xit("B", function () {
        const lines: string[] = [
            `z=2`,
            `P=[x,y,z]`,
            `a=abs(cross(d(P,x),d(P,y)))`,
            `a`
            //            `defint(a,y,-sqrt(1-x^2),sqrt(1-x^2),x,-1,1)`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: true
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "(1-2*d(x,y)*d(y,x)+d(x,y)^2*d(y,x)^2)^(1/2)");
        engine.release();
    });
});
