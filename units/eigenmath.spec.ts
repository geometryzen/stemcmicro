import { assert } from "chai";
import { executeScript, ScriptContentHandler, ScriptErrorHandler, ScriptVars } from "../src/eigenmath/index";
import { U } from "../src/tree/tree";

class TestContentHandler implements ScriptContentHandler {
    values: U[] = [];
    inputs: U[] = [];
    begin(): void {
        this.values.length = 0;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: ScriptVars): void {
        this.values.push(value);
        this.inputs.push(input);
    }
    end(): void {
    }
}

class TestErrorHandler implements ScriptErrorHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(inbuf: string, start: number, end: number, err: unknown): void {

    }
}

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
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 5);
        // The output currently contains svg...
        // const value = values[0];
        // assert.strictEqual(value, "?");
    });
});
