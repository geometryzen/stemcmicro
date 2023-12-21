import { assert } from "chai";
import { executeScript } from "../src/eigenmath/index";

describe("eigenmath", function () {
    xit("A", function () {
        const lines: string[] = [
            `A=0`,
            `A`
        ];
        const scriptText = lines.join('\n');
        const values = executeScript(scriptText);
        assert.strictEqual(values.length, 1);
        // The output currently contains svg...
        // const value = values[0];
        // assert.strictEqual(value, "?");
    });
});
