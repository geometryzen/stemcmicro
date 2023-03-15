import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

xdescribe("not", function () {
    it("not(sqrt(pi/4)-sqrt(i))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `not(sqrt(pi/4)-sqrt(i))`
        ];
        const engine = create_script_context({
            useIntegersForPredicates: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
});
