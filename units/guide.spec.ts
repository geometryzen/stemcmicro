import { assert } from "chai";
import { createScriptEngine } from "../index";

describe("guide", function () {
    it("Experiment 001", function () {
        const lines: string[] = [
            `z=x+i*y`,
            `sin(z)`
        ];
        const engine = createScriptEngine({
            dependencies: [],
            useDefinitions: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)*sin(i*y)+cos(i*y)*sin(x)");
        engine.release();
    });
    it("Experiment 002", function () {
        const lines: string[] = [
            `z=x+i*y`,
            `sin(z)`
        ];
        // The problem is that we need the imaginary unit dependency.
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // TODO: This should expand.
        assert.strictEqual(engine.renderAsInfix(values[0]), "cos(x)*sin(i*y)+cos(i*y)*sin(x)");
        engine.release();
    });
});
