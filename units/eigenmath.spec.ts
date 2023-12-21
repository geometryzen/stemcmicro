import { assert } from "chai";
import { executeScript } from "../src/eigenmath/index";

describe("eigenmath", function () {
    // "stack error" if run while running other tests?
    it("A", function () {
        const lines: string[] = [
            `trace=0`,
            `f=sin(x)/x`,
            `f`,
            `yrange=(-1,1)`,
            `draw(f,x)`
        ];
        const scriptText = lines.join('\n');
        const values = executeScript(scriptText);
        assert.strictEqual(values.length, 2);
        // The output currently contains svg...
        // const value = values[0];
        // assert.strictEqual(value, "?");
    });
});
