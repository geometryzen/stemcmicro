import { assert } from "chai";
import { Cons, nil, U } from "math-expression-tree";
import { executeScript, ScriptContentHandler, ScriptErrorHandler, ScriptVars, to_infix, to_sexpr } from "../src/eigenmath/index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eval_plot = function (expr: Cons, $: ScriptVars): void {
    $.push(nil);
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
        throw new Error(`${inbuf} ${start} ${end} ${err}`);
    }
}

describe("eigenmath", function () {
    it("A", function () {
        const lines: string[] = [
            `x`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value), "x");
    });
    it("B", function () {
        const lines: string[] = [
            `x^y`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useCaretForExponentiation: true }), "x^y");
    });
    it("C", function () {
        const lines: string[] = [
            `x^y`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useCaretForExponentiation: false }), "x**y");
    });
    it("D", function () {
        const lines: string[] = [
            `x^y`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_sexpr(value), "(^ x y)");
    });
    it("E", function () {
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
        assert.strictEqual(values.length, 6);
        assert.strictEqual(to_infix(values[0]), " ? ");
        assert.strictEqual(to_infix(values[1]), " ? ");
        assert.strictEqual(to_infix(values[2]), "sin(x) / x");
        assert.strictEqual(to_infix(values[3]), " ? ");
        assert.strictEqual(to_infix(values[4]), " ? ");
    });
    it("F", function () {
        const lines: string[] = [
            `(-1,1)`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value), "[-1,1]");
    });
    it("G", function () {
        const lines: string[] = [
            `(-1,1)`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value, { useParenForTensors: true }), "(-1,1)");
    });
    it("H", function () {
        const lines: string[] = [
            `uom("kilogram")`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value), "kg");
    });
    it("I", function () {
        const lines: string[] = [
            `uom("meter")`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_sexpr(value), "m");
    });
    xit("J", function () {
        const lines: string[] = [
            `uom("kilogram") * uom("meter")`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value), "kg m");
    });
    it("K", function () {
        const lines: string[] = [
            `algebra((1,1,1),("e1","e2","e3"))`,
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 1);
        const value = values[0];
        assert.strictEqual(to_infix(value), "[e1,e2,e3]");
    });
    it("L", function () {
        const lines: string[] = [
            `G = algebra((1,1,1),("e1","e2","e3"))`,
            `i = G[1]`,
            `j = G[2]`,
            `k = G[3]`,
            `i`
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 5);
        const value = values[4];
        assert.strictEqual(to_infix(value), "e1");
    });
    xit("M", function () {
        const lines: string[] = [
            `G = algebra((1,1,1),("e1","e2","e3"))`,
            `i = G[1]`,
            `j = G[2]`,
            `k = G[3]`,
            `i * j`
        ];
        const scriptText = lines.join('\n');
        const contentHandler = new TestContentHandler();
        const errorHandler = new TestErrorHandler();
        executeScript(scriptText, contentHandler, errorHandler);
        const values = contentHandler.values;
        assert.strictEqual(values.length, 5);
        const value = values[4];
        assert.strictEqual(to_infix(value), "e1");
    });
});
