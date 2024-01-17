
import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";
import { pythonscript_parse } from "../src/pythonscript/pythonscript_parse";

describe("Python parse", function () {
    it("def f(x): return x", function () {
        const lines: string[] = [
            `def f(x): return a*x`
        ];

        const context = create_script_context({});

        const { trees } = pythonscript_parse(lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(context.renderAsSExpr(tree), "(define f (lambda (x) (* a x)))");
        context.release();
    });
    it("def f(x): return x", function () {
        const lines: string[] = [
            `def f(x): return a*x`,
            `f(1)`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const { values } = context.executeScript(sourceText, { syntaxKind: SyntaxKind.PythonScript });
        assert.isArray(values);
        assert.strictEqual(values.length, 2);
        // TODO: This should create a binding which contains the lambda expression.
        // 
        assert.strictEqual(context.renderAsSExpr(values[0]), "(define f (lambda (x) (* a x)))");
        assert.strictEqual(context.renderAsSExpr(values[1]), "(f 1)");
        context.release();
    });
});