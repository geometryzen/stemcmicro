
import { assert } from "chai";
import { create_sym, Sym } from "math-expression-atoms";
import { is_native_sym } from "math-expression-native";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, ExprEngineListener, run_module, run_script, ScriptHandler } from "../src/api/index";
import { Scope, State, Stepper } from "../src/clojurescript/runtime/Stepper";
import { iszero, ScriptOutputListener } from "../src/eigenmath/eigenmath";
import { print_value_and_input_as_svg_or_infix } from "../src/eigenmath/print_value_and_input_as_svg_or_infix";
import { SvgRenderConfig } from "../src/eigenmath/render_svg";
import { should_engine_render_svg } from "../src/eigenmath/should_engine_render_svg";
import { Stack } from "../src/env/Stack";
import { SyntaxKind } from "../src/parser/parser";

export function should_stepper_render_svg(stepper: Stepper): boolean {
    const $: Scope = stepper.stack.top.$;
    const sym: Sym = create_sym("tty");
    const tty = $.getBinding(sym);
    if (is_nil(tty)) {
        // Unbound in Native engine.
        return true;
    }
    else if (tty.equals(sym)) {
        // Unbound in Eigenmath engine.
        return true;
    }
    else if (iszero(tty)) {
        // Bound to zero.
        return true;
    }
    else {
        return false;
    }
}

class TestScriptListener implements ExprEngineListener {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly outer: TestScriptHandler) {

    }
    output(output: string): void {
        // console.lg(`${output}`);
        this.outer.outputs.push(output);
    }
}

class TestStepperListener implements ExprEngineListener {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly outer: TestStepperHandler) {

    }
    output(output: string): void {
        // console.lg(`${output}`);
        this.outer.outputs.push(output);
    }
}

class TestScriptOutputListener implements ScriptOutputListener {
    constructor(private readonly outer: TestScriptListener) {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(output: string): void {
        this.outer.output(output);
    }
}

class TestStepperOutputListener implements ScriptOutputListener {
    constructor(private readonly outer: TestStepperListener) {

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(output: string): void {
        this.outer.output(output);
    }
}

class TestScriptHandler implements ScriptHandler<ExprEngine> {
    outputs: string[] = [];
    private readonly listener: TestScriptListener;
    constructor() {
        this.listener = new TestScriptListener(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {
        // console.lg(`begin`);
        $.addListener(this.listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: ExprEngine): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const config: RenderConfig = { useCaretForExponentiation: false, useParenForTensors: false };
        // console.lg(`output value => ${$.renderAsString(value, config)} input => ${$.renderAsString(input, config)}`);
        const listener = new TestScriptOutputListener(this.listener);
        const ec: SvgRenderConfig = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        function should_annotate_symbol(x: Sym, value: U): boolean {
            if ($.hasUserFunction(x)) {
                if (x.equals(value) || is_nil(value)) {
                    return false;
                }
                /*
                if (x.equals(I_LOWER) && isimaginaryunit(value))
                    return false;
        
                if (x.equals(J_LOWER) && isimaginaryunit(value))
                    return false;
                */

                return true;
            }
            else {
                if (is_native_sym(x)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        print_value_and_input_as_svg_or_infix(value, input, should_engine_render_svg($), ec, [listener], should_annotate_symbol);

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {
        // console.lg(`text => ${text}`);
        // throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
        // console.lg(`end`);
        $.removeListener(this.listener);
    }
}

class TestStepperHandler implements ScriptHandler<Stepper> {
    outputs: string[] = [];
    private readonly listener: TestStepperListener;
    constructor() {
        this.listener = new TestStepperListener(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: Stepper): void {
        // console.lg(`begin`);
        $.addListener(this.listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: Stepper): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // const config: RenderConfig = { useCaretForExponentiation: false, useParenForTensors: false };
        // console.lg(`output value => ${$.renderAsString(value, config)} input => ${$.renderAsString(input, config)}`);
        const listener = new TestStepperOutputListener(this.listener);
        const ec: SvgRenderConfig = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        function should_annotate_symbol(x: Sym, value: U): boolean {
            const state: Stack<State> = $.stack;
            const top: State = state.top;
            const scope: Scope = top.$;
            if (scope.hasUserFunction(x)) {
                if (x.equals(value) || is_nil(value)) {
                    return false;
                }
                /*
                if (x.equals(I_LOWER) && isimaginaryunit(value))
                    return false;
        
                if (x.equals(J_LOWER) && isimaginaryunit(value))
                    return false;
                */

                return true;
            }
            else {
                if (is_native_sym(x)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        print_value_and_input_as_svg_or_infix(value, input, should_stepper_render_svg($), ec, [listener], should_annotate_symbol);

    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {
        // console.lg(`text => ${text}`);
        // throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: Stepper): void {
        // console.lg(`end`);
        $.removeListener(this.listener);
    }
}

describe("handler", function () {
    it("Algebrite", function () {
        const lines: string[] = [
            `trace=1`,
            `f=sin(x)/x+0.5`,
            `f`,
            `yrange=[-1,1]`,
            `yrange`,
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        assert.strictEqual(should_engine_render_svg(engine), true);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 6);
        const handler = new TestScriptHandler();
        run_script(engine, trees, handler);
        assert.strictEqual(handler.outputs.length, 2);
        // console.lg(`${handler.outputs[0]}`);   // f=sin(x)/x
        // console.lg(`${handler.outputs[1]}`);   // yrange
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
        const engine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        assert.strictEqual(should_engine_render_svg(engine), true);
        const { trees, errors } = engine.parse(sourceText, { useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 6);
        // assert.strictEqual(is_nil(trees[5]), true);
        const handler = new TestScriptHandler();
        run_script(engine, trees, handler);
        assert.strictEqual(handler.outputs.length, 3);
        // console.lg(`${handler.outputs[0]}`);   // f=sin(x)/x
        // console.lg(`${handler.outputs[1]}`);   // yrange
        // console.lg(`${handler.outputs[2]}`);   // draw
        engine.release();
    });
    it("Stepper", function () {
        const lines: string[] = [
            `trace=1`,
            `f=sin(x)/x`,
            `f`,
            `yrange=[-1,1]`,
            `yrange`,
            `draw(f,x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        assert.strictEqual(should_engine_render_svg(engine), true);
        const { module, errors } = engine.parseModule(sourceText, { useParenForTensors: false });
        assert.strictEqual(errors.length, 0);
        // assert.strictEqual(is_nil(trees[5]), true);
        const handler = new TestStepperHandler();
        run_module(module, handler);
        assert.strictEqual(handler.outputs.length, 2);
        // console.lg(`${handler.outputs[0]}`);   // f=sin(x)/x
        // console.lg(`${handler.outputs[1]}`);   // yrange
        // console.lg(`${handler.outputs[2]}`);   // draw
        engine.release();
    });
});
