
import { assert } from "chai";
import { Sym } from "math-expression-atoms";
import { is_native_sym } from "math-expression-native";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, ScriptHandler, should_render_svg, UndeclaredVars } from "../src/api/index";
import { State, Stepper, StepperHandler } from "../src/clojurescript/runtime/Stepper";
import { ScriptOutputListener } from "../src/eigenmath";
import { EmitContext, print_value_and_input_as_svg_or_infix } from "../src/eigenmath/render_svg";
import { Stack } from "../src/env/Stack";
import { is_sym } from "../src/operators/sym/is_sym";
import { SyntaxKind } from "../src/parser/parser";

class TestScriptListener implements ScriptOutputListener {
    readonly #handler: TestScriptHandler;
    constructor(handler: TestScriptHandler) {
        this.#handler = handler;
    }
    output(output: string): void {
        this.#handler.outputs.push(output);
    }
}

class TestScriptHandler implements ScriptHandler<ExprEngine>, StepperHandler {
    #engine: ExprEngine;
    readonly outputs: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor($: ExprEngine) {
        this.#engine = $;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: ExprEngine): void {
        throw new Error("outpu method not implemented.");
    }
    atom(value: U, input: U): void {
        const ec: EmitContext = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false,//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        const listener = new TestScriptListener(this);
        const should_annotate_symbol = (x: Sym, value: U): boolean => {
            if (this.#engine.hasUserFunction(x)) {
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
        };
        print_value_and_input_as_svg_or_infix(value, input, should_render_svg(this.#engine), ec, [listener], should_annotate_symbol, this.#engine);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {
        throw new Error("text method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
    }
}

function peek(stack: Stack<State>) {
    for (let i = 0; i < stack.length; i++) {
        const state: State = stack.peek(i);
        // We never get to see a state where the input is an atom!
        if (is_sym(state.input)) {
            // eslint-disable-next-line no-console
            // console.lg(`${i}: input`, `${state.input}`, "value", `${state.value}`);
        }
    }
}

const expect0: string = [
    `<svg height='36'width='57'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='10'y='26'>t</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='16.66796875'y='26'>r</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='24.66015625'y='26'>u</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='36.66015625'y='26'>e</text>`,
    `</svg>`,
].join('');

const expect1: string = [
    `<svg height='36'width='106'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='26'>x</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='32.65234375'y='26'>=</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='58.1875'y='26'>t</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='64.85546875'y='26'>r</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='72.84765625'y='26'>u</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;'x='84.84765625'y='26'>e</text>`,
    `</svg>`,
].join('');

describe("Stepper", function () {
    it("101", function () {
        const lines: string[] = [
            `(= x true)`,
            `x`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
        try {
            const { module } = engine.parseModule(sourceText, {});
            const stepper = new Stepper(module);
            const stack = stepper.stack;
            const handler = new TestScriptHandler(engine);
            handler.begin(engine);
            try {
                assert.strictEqual(stack.length, 1);
                assert.strictEqual(handler.outputs.length, 0);
                peek(stack);

                assert.isTrue(stepper.next(handler));
                assert.strictEqual(stack.length, 3);
                assert.strictEqual(handler.outputs.length, 0);
                peek(stack);

                assert.isTrue(stepper.next(handler));
                assert.strictEqual(stack.length, 2);
                assert.strictEqual(handler.outputs.length, 1);
                assert.strictEqual(handler.outputs[0], expect0);
                peek(stack);

                assert.isTrue(stepper.next(handler));
                assert.strictEqual(stack.length, 1);
                assert.strictEqual(handler.outputs.length, 1);
                peek(stack);

                assert.isTrue(stepper.next(handler));
                assert.strictEqual(stack.length, 1);
                assert.strictEqual(handler.outputs.length, 2);
                assert.strictEqual(handler.outputs[0], expect0);
                assert.strictEqual(handler.outputs[1], expect1);
                peek(stack);

                assert.isFalse(stepper.next(handler));
                assert.strictEqual(stack.length, 1);
                assert.strictEqual(handler.outputs.length, 2);
                peek(stack);
            }
            finally {
                handler.end(engine);
            }
        }
        finally {
            engine.release();
        }
    });
});