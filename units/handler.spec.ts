
import { assert } from "chai";
import { U } from "math-expression-tree";
import { create_engine, ExprEngine, ExprEngineListener, RenderConfig, run_script, ScriptHandler, should_render_svg } from "../src/api/index";
import { EmitContext, print_result_and_input, ScriptOutputListener } from "../src/eigenmath";

class TestScriptListener implements ExprEngineListener {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly outer: TestScriptHandler) {

    }
    output(output: string): void {
        // console.log(`${output}`);
        this.outer.outputs.push(output);
    }
}

class TestScriptOutputListener implements ScriptOutputListener {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(output: string): void {
        // console.log(`${output}`);
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
        // console.log(`output value => ${$.renderAsString(value, config)} input => ${$.renderAsString(input, config)}`);
        const listener = new TestScriptOutputListener();
        const ec: EmitContext = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        print_result_and_input(value, input, should_render_svg($), ec, [listener]);

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
    it("Native", function () {
        const lines: string[] = [
            `trace=1`,
            `f=sin(x)/x+0.5`,
            `f`,
            `yrange=[-1,1]`,
            `yrange`,
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine({ useGeometricAlgebra: true });
        assert.strictEqual(should_render_svg(engine), true);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        const handler = new TestScriptHandler();
        run_script(engine, trees, handler);
        engine.release();
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
        const engine = create_engine();
        assert.strictEqual(should_render_svg(engine), true);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        const handler = new TestScriptHandler();
        run_script(engine, trees, handler);
        engine.release();
    });
});