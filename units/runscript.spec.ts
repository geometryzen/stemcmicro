
import { assert } from "chai";
import { Sym } from "math-expression-atoms";
import { is_native_sym } from "math-expression-native";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, run_script, ScriptHandler, should_render_svg } from "../src/api/index";
import { EmitContext, print_result_and_input, ScriptOutputListener } from "../src/eigenmath";

class TestScriptOutputListener implements ScriptOutputListener {
    readonly #outer: TestHandler;
    constructor(outer: TestHandler) {
        this.#outer = outer;
    }
    output(output: string): void {
        this.#outer.outputs.push(output);
    }
}

class TestHandler implements ScriptHandler<ExprEngine>{
    outputs: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    begin($: ExprEngine): void {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output(value: U, input: U, $: ExprEngine): void {
        const ec: EmitContext = {
            useImaginaryI: true,//isimaginaryunit(get_binding(symbol(I_LOWER), $)),
            useImaginaryJ: false,//isimaginaryunit(get_binding(symbol(J_LOWER), $))
        };
        // 
        const listener: ScriptOutputListener = new TestScriptOutputListener(this);
        function should_annotate_symbol(x: Sym, value: U): boolean {
            if ($.isUserSymbol(x)) {
                // console.lg(`isUserSymbol(${x})=>true`);
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
                // console.lg(`isUserSymbol(${x})=>false`);
                if (is_native_sym(x)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        print_result_and_input(value, input, should_render_svg($), ec, [listener], should_annotate_symbol, $);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {
        throw new Error("TestHandler.text Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
    }
}

describe("runscript", function () {
    it("Eigenmath", function () {
        const lines: string[] = [
            `trace=1`,
            `tty=0`,
            `f=sin(x)/x`,
            `f`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const handler = new TestHandler();
        run_script(engine, trees, handler);
        const outputs = handler.outputs;
        assert.strictEqual(outputs.length, 1);
        const actual = outputs[0];
        const svg: string[] = [
            `<svg height='69'width='128'>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='45'>f</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='31.66796875'y='45'>=</text>`,
            `<line x1='57.203125'y1='37.0546875'x2='117.84765625'y2='37.0546875'style='stroke:black;stroke-width:1.6800000000000002'/>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='60.203125'y='25.904296875'>s</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='69.54296875'y='25.904296875'>i</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='76.2109375'y='25.904296875'>n</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='88.2109375'y='25.904296875'>(</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='106.85546875'y='25.904296875'>)</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='96.203125'y='25.904296875'>x</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='82.19921875'y='58.904296875'>x</text>`,
            `</svg><br>`];
        const expected = svg.join('');
        assert.strictEqual(actual.length, expected.length);
        assert.strictEqual(actual, expected);
        engine.release();
    });
    it("Algebrite", function () {
        const lines: string[] = [
            `trace=1`,
            `tty=0`,
            `f=sin(x)/x`,
            `f`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        const handler = new TestHandler();
        run_script(engine, trees, handler);
        const outputs = handler.outputs;
        assert.strictEqual(outputs.length, 1);
        const actual = outputs[0];
        // TOD: Not getting the "f = "
        const svg: string[] = [
            `<svg height='69'width='81'>`,
            `<line x1='10'y1='37.0546875'x2='70.64453125'y2='37.0546875'style='stroke:black;stroke-width:1.6800000000000002'/>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='13'y='25.904296875'>s</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='22.33984375'y='25.904296875'>i</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='29.0078125'y='25.904296875'>n</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='41.0078125'y='25.904296875'>(</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='59.65234375'y='25.904296875'>)</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='49'y='25.904296875'>x</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='34.99609375'y='58.904296875'>x</text>`,
            `</svg><br>`
        ];
        const expected = svg.join('');
        assert.strictEqual(actual.length, expected.length);
        assert.strictEqual(actual, expected);
        engine.release();
    });
});