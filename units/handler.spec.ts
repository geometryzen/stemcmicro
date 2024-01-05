
import { assert } from "chai";
import { U } from "math-expression-tree";
import { ExprEngine, ExprEngineListener, parse, RenderConfig, run_script, ScriptHandler } from "../src/api/index";

class TestScriptListener implements ExprEngineListener {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly outer: TestScriptHandler) {

    }
    output(output: string): void {
        // console.log(`${output}`);
        this.outer.outputs.push(output);
    }
}

class TestScriptHandler implements ScriptHandler {
    outputs: string[] = [];
    private readonly listener: TestScriptListener;
    constructor() {
        this.listener = new TestScriptListener(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {
        // console.log(`begin`);
        $.addListener(this.listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: ExprEngine): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const config: RenderConfig = { useCaretForExponentiation: false, useParenForTensors: false };
        // console.lg(`output value => ${$.renderAsString(value, config)} input => ${$.renderAsString(input, config)}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {
        // console.log(`text => ${text}`);
        // throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
        // console.log(`end`);
        $.removeListener(this.listener);
    }
}

describe("handler", function () {
    xit("Native", function () {
        const lines: string[] = [
            `trace=1`,
            `f=sin(x)/x`,
            `f`,
            `yrange=[-1,1]`,
            `yrange`,
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: true, useCaretForExponentiation: true, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        const handler = new TestScriptHandler();
        run_script(trees, { useGeometricAlgebra: true }, handler);
    });
    it("Eigenmath", function () {
        const lines: string[] = [
            `trace=1`,
            `f=sin(x)/x`,
            `f`,
            `yrange=[-1,1]`,
            `yrange`,
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const { trees, errors } = parse(sourceText, { useGeometricAlgebra: false, useCaretForExponentiation: false, useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        const handler = new TestScriptHandler();
        run_script(trees, { useGeometricAlgebra: false }, handler);
    });
});