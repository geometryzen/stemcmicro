import { assert } from "chai";
import { U } from "math-expression-tree";
import { executeScript, ScriptContentHandler, ScriptErrorHandler, ScriptVars, to_infix } from "../src/eigenmath/index";
import { create_script_context } from "../src/runtime/script_engine";

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

describe("eigenmath-juxtaposition", function () {
    it("A", function () {
        const lines: string[] = [
            `5*a*b`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler, { useCaretForExponentiation: true, useParenForTensors: false });
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useParenForTensors: false }), "5 a b");
    });
    it("B", function () {
        const lines: string[] = [
            `5 a b`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler, { useCaretForExponentiation: true, useParenForTensors: false });
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useParenForTensors: false }), "5 a b");
    });
});

describe("juxtaposition", function () {
    it("A", function () {
        const lines: string[] = [
            `5*a*b`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values, errors } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* 5 a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "5*a*b");
        engine.release();
    });
    xit("B", function () {
        const lines: string[] = [
            `5 a b`
        ];
        const engine = create_script_context({
            useCaretForExponentiation: false
        });
        const { values, errors } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(* 5 a b)");
        assert.strictEqual(engine.renderAsInfix(values[0]), "5*a*b");
        engine.release();
    });
});
