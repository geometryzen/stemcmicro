import { assert } from "chai";
import { U } from "math-expression-tree";
import { execute_eigenmath_script } from '../src/eigenmath/execute_eigenmath_script';
import { ScriptContentHandler, ScriptErrorHandler, ScriptVars } from "../src/eigenmath/eigenmath";
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

describe("eigenmath-mul", function () {
    it("A", function () {
        const lines: string[] = [
            `uom("kilogram") * uom("meter")`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        execute_eigenmath_script(scriptText, contentHandler, errorHandler, { useCaretForExponentiation: true, useParenForTensors: false });
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useParenForTensors: false }), "kg m");
    });
    it("B", function () {
        const lines: string[] = [
            `uom("meter") * uom("kilogram")`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        execute_eigenmath_script(scriptText, contentHandler, errorHandler, { useCaretForExponentiation: true, useParenForTensors: false });
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useParenForTensors: false }), "kg m");
    });
});

