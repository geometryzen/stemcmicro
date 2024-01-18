
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
        print_result_and_input(value, input, should_render_svg($), ec, [listener], should_annotate_symbol);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text(text: string): void {
        throw new Error("TestHandler.text Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
    }
}

describe("sandbox", function () {
    it("Maps", function () {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const actual = outputs[0];
        // The following is the output for useGeometricAlgebra: false
        // It's still not correct because sin should have the same font-size.
        // It is correctly determining that the symbol f is a user symbol and so should annotate the output.
        const svg: string[] = [
            `<svg height='72'width='125'>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='10'y='48'>f</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='31.66796875'y='48'>=</text>`,
            `<line x1='57.203125'y1='40.0546875'x2='115.1806640625'y2='40.0546875'style='stroke:black;stroke-width:1.6800000000000002'/>\n`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='60.203125'y='26.150390625'>s</text>`,
            `<text style='font-family:"Times New Roman";font-size:18px;font-style:italic;'x='71.54296875'y='34.095703125'>i</text>`,
            `<text style='font-family:"Times New Roman";font-size:18px;font-style:italic;'x='76.5439453125'y='34.095703125'>n</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='85.5439453125'y='26.150390625'>(</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;'x='104.1884765625'y='26.150390625'>)</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='93.5361328125'y='26.150390625'>x</text>`,
            `<text style='font-family:"Times New Roman";font-size:24px;font-style:italic;'x='80.86572265625'y='61.904296875'>x</text>`,
            `</svg><br>`];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const expected = svg.join('');
        // assert.strictEqual(actual, expected);
        engine.release();
    });
});