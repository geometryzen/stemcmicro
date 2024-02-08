
import { assert } from "chai";
import { is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";

describe("sample", function () {
    it("(a+b) squared", function () {
        const lines: string[] = [
            `(a+b)^2`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath, useCaretForExponentiation: true });
        const { trees, errors } = engine.parse(sourceText, { useParenForTensors: false });
        if (errors.length > 0) {
            // eslint-disable-next-line no-console
            console.log(errors[0]);
        }
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], {}), 'a**2 + 2 a b + b**2');
        engine.release();
    });
});

xdescribe("Eigenmath", function () {
    it("kronecker", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `B=[[a,b],[c,d]]`,
            `kronecker(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        const { trees, errors } = engine.parse(sourceText, { useParenForTensors: false });
        if (errors.length > 0) {
            // eslint-disable-next-line no-console
            console.log(errors[0]);
        }
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], {}), "[[a,b,2 a,2 b],[c,d,2 c,2 d],[3 a,3 b,4 a,4 b],[3 c,3 d,4 c,4 d]]");
        engine.release();
    });
});

xdescribe("Micro", function () {
    it("kronecker", function () {
        const lines: string[] = [
            `A=[[1,2],[3,4]]`,
            `B=[[a,b],[c,d]]`,
            `kronecker(A,B)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({});
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], {}), "[[a,b,2*a,2*b],[c,d,2*c,2*d],[3*a,3*b,4*a,4*b],[3*c,3*d,4*c,4*d]]");
        engine.release();
    });
});