
import { assert } from "chai";
import { Boo, Flt, Keyword, Map, Rat, Str, Sym, Tag, Tensor } from "math-expression-atoms";
import { is_native_sym } from "math-expression-native";
import { Cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine, run_script, ScriptHandler, UndeclaredVars } from "../src/api/index";
import { ScriptOutputListener } from "../src/eigenmath/eigenmath";
import { print_value_and_input_as_svg_or_infix } from "../src/eigenmath/print_value_and_input_as_svg_or_infix";
import { EmitContext } from "../src/eigenmath/render_svg";
import { should_engine_render_svg } from "../src/eigenmath/should_engine_render_svg";
import { SyntaxKind } from "../src/parser/parser";
import { visit } from "../src/visitor/visit";
import { Visitor } from "../src/visitor/Visitor";

const algebrite_source: string[] = [
    `trace=1`,
    `tty=0`,
    `f=sin(x)/x`,
    `f`
];

const clojurescript_source: string[] = [
    `(= trace 1)`,
    `(= tty 0)`,
    `(= f (* (sin x) (pow x -1)))`,
    `f`
];

const eigenmath_source: string[] = [
    `trace=1`,
    `tty=0`,
    `f=sin(x)/x`,
    `f`
];

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
    `</svg>`
];

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
            if ($.hasUserFunction(x)) {
                // console.lg(`hasUserFunction(${x})=>true`);
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
                // console.lg(`hasUserFunction(${x})=>false`);
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
        throw new Error("TestHandler.text Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    end($: ExprEngine): void {
    }
}

/**
 * Eigenmath adds more whitespace on infix expressions.
 */
function strip_whitespace(s: string): string {
    return s.replace(/\s/g, '');
}

class Voyeur implements Visitor {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tag(tag: Tag): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    keyword(keyword: Keyword): void {
        throw new Error("Voyeur.keyword method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginCons(expr: Cons): void {
        // console.lg(`beginCons ${expr.opr}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endCons(expr: Cons): void {
        // console.lg(`endCons ${expr.opr}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginTensor(tensor: Tensor<U>): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endTensor(tensor: Tensor<U>): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beginMap(map: Map): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endMap(map: Map): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    boo(boo: Boo): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sym(sym: Sym): void {
        // console.lg(`${sym}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rat(rat: Rat): void {
        // console.lg(`${rat}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    str(str: Str): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    flt(flt: Flt): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    atom(atom: U): void {
        throw new Error("Method not implemented.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nil(expr: U): void {
        throw new Error("Method not implemented.");
    }

}

function assert_parse(trees: U[], errors: Error[], engine: ExprEngine) {
    assert.strictEqual(trees.length, 4);
    assert.strictEqual(errors.length, 0);

    const voyeur = new Voyeur();
    visit(trees[2], voyeur);

    assert.strictEqual(engine.renderAsString(trees[0], { format: 'SExpr' }), "(= trace 1)");
    assert.strictEqual(engine.renderAsString(trees[1], { format: 'SExpr' }), "(= tty 0)");
    assert.strictEqual(engine.renderAsString(trees[2], { format: 'SExpr' }), "(= f (* (sin x) (pow x -1)))");
    assert.strictEqual(engine.renderAsString(trees[3], { format: 'SExpr' }), "f");

    assert.strictEqual(strip_whitespace(engine.renderAsString(trees[0])), strip_whitespace("trace = 1"));
    assert.strictEqual(strip_whitespace(engine.renderAsString(trees[1])), strip_whitespace("tty = 0"));
    // Why does ClojureScript get this wrong?
    // assert.strictEqual(strip_whitespace(engine.renderAsString(trees[2])), strip_whitespace("f = sin(x) / x"));
    assert.strictEqual(engine.renderAsString(trees[3]), "f");
}

describe("runscript", function () {
    xit("Algebrite", function () {
        const sourceText = algebrite_source.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});

        assert_parse(trees, errors, engine);

        const handler = new TestHandler();
        run_script(engine, trees, handler);
        const outputs = handler.outputs;
        assert.strictEqual(outputs.length, 1);
        const actual = outputs[0];
        const expected = svg.join('');
        assert.strictEqual(actual.length, expected.length);
        assert.strictEqual(actual, expected);
        engine.release();
    });
    xit("ClojureScript", function () {
        const sourceText = clojurescript_source.join('\n');
        const engine: ExprEngine = create_engine({ allowUndeclaredVars: UndeclaredVars.Nil, syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});

        assert_parse(trees, errors, engine);

        const handler = new TestHandler();
        run_script(engine, trees, handler);
        const outputs = handler.outputs;
        assert.strictEqual(outputs.length, 1);
        const actual = outputs[0];
        const expected = svg.join('');
        assert.strictEqual(actual.length, expected.length);
        assert.strictEqual(actual, expected);
        engine.release();
    });
    xit("Eigenmath", function () {
        const sourceText = eigenmath_source.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        const { trees, errors } = engine.parse(sourceText, {});

        assert_parse(trees, errors, engine);

        const handler = new TestHandler();
        run_script(engine, trees, handler);
        const outputs = handler.outputs;
        assert.strictEqual(outputs.length, 1);
        const actual = outputs[0];
        const expected = svg.join('');
        assert.strictEqual(actual.length, expected.length);
        assert.strictEqual(actual, expected);
        engine.release();
    });
});