import { assert } from "chai";
import { U } from "math-expression-tree";
import { executeScript, ScriptContentHandler, ScriptErrorHandler, ScriptVars } from "../src/eigenmath/index";
import { to_infix } from "../src/eigenmath/infixform";

class TestContentHandler implements ScriptContentHandler {
    values: U[] = [];
    inputs: U[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ScriptVars): void {
        this.values.length = 0;
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
        throw new Error(`${inbuf} ${start} ${end} ${err}`);
    }
}

describe("eigenmath", function () {
    it("P", function () {
        const lines: string[] = [
            `[-1,1]`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler, { useCaretForExponentiation: true, useParenForTensors: false });
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useParenForTensors: false }), "[-1,1]");
    });
});
