import { assert } from "chai";
import { executeScript, ScriptContentHandler, ScriptErrorHandler, ScriptVars } from "../src/eigenmath/index";
import { Cons, U } from "../src/tree/tree";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eval_plot = function (expr: Cons, $: ScriptVars): void {
    // console.log(`${expr}`);
};

class TestContentHandler implements ScriptContentHandler {
    values: U[] = [];
    inputs: U[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ScriptVars): void {
        this.values.length = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        $.defineFunction("plot", eval_plot);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: ScriptVars): void {
        this.values.push(value);
        this.inputs.push(input);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ScriptVars): void {
    }
}

class TestErrorHandler implements ScriptErrorHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(inbuf: string, start: number, end: number, err: unknown, $: ScriptVars): void {

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
            `draw(f,x)`,
            `plot(f,x)`
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
