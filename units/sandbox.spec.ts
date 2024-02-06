
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
    it("det(A) * inv(A)", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `det(A) * inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine(engineConfig);
        const { trees, errors } = engine.parse(sourceText, parseConfig);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(strip_whitespace(engine.renderAsString(values[0], renderConfig)), strip_whitespace("[[a*d^2/(a*d-b*c)-b*c*d/(a*d-b*c),-a*b*d/(a*d-b*c)+b^2*c/(a*d-b*c)],[-a*c*d/(a*d-b*c)+b*c^2/(a*d-b*c),-a*b*c/(a*d-b*c)+a^2*d/(a*d-b*c)]]"));
        engine.release();
    });
});