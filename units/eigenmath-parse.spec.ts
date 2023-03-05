
import { assert } from "chai";
import { eigenmath_parse } from "../src/brite/eigenmath_parse";
import { create_script_context } from "../src/runtime/script_engine";
import { scheme_parse } from "../src/scheme/scheme_parse";
import { python_parse } from "../src/typhon/python_parse";

describe("eigenmath-parse", function () {
    it("f(x) = x", function () {
        const lines: string[] = [
            `f(x) = x`
        ];

        const engine = create_script_context({});

        const { trees } = eigenmath_parse('foo.ts', lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), "(= (f x) x)");
        engine.release();
    });
    // Python won't allow assignment to a function call.
    it("def f(x): return x", function () {
        const lines: string[] = [
            `def f(x): return x`
        ];

        const engine = create_script_context({});

        const { trees } = python_parse('foo.ts', lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), "(define f (lambda (x) x))");
        engine.release();
    });
    it("(lambda (x) x)", function () {
        const lines: string[] = [
            `(define f (lambda (x) x))`
        ];

        const engine = create_script_context({});

        const { trees } = scheme_parse('foo.ts', lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), "(define f (lambda (x) x))");
        engine.release();
    });
});
