
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, EngineConfig, ExprEngine, ParseConfig, RenderConfig } from "../src/api/api";


const engineConfig: Partial<EngineConfig> = {
};

function strip_whitespace(s: string): string {
    return s.replace(/\s/g, '');
}

const parseConfig: ParseConfig = {
    useCaretForExponentiation: true,
    useParenForTensors: false
};

const renderConfig: RenderConfig = {
    format: 'Infix',
    useCaretForExponentiation: true,
    useParenForTensors: false
};

describe("sandbox", function () {
    it("(pow (+ 1 x) 2)", function () {
        const lines: string[] = [
            `(x+1)^2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            try {
                const value = engine.valueOf(tree);
                if (!is_nil(value)) {
                    values.push(value);
                }
            }
            catch (e) {
                assert.fail(`${e}`, "???");
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace(`1+2*x+x^2`));
        engine.release();
    });
});