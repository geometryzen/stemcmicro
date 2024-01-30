
import { assert } from "chai";
import { create_sym, is_boo, is_flt, is_str, JsObject } from "math-expression-atoms";
import { is_nil, nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

class FauxTarget {
    bvalue = true;
    nvalue = 137;
    svalue = "Hello";
}

class FauxEvent {
    target = new FauxTarget();
}

describe("dotdot", function () {
    it("svalue", function () {
        const lines: string[] = [
            `(.. e -target -svalue)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const event = new FauxEvent();
        const obj = new JsObject(event);
        // FIXME: This is ugly...
        engine.setSymbol(create_sym('e'), obj, nil);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '"Hello"');
        assert.strictEqual(is_str(values[0]), true);
        engine.release();
    });
    it("nvalue", function () {
        const lines: string[] = [
            `(.. e -target -nvalue)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const event = new FauxEvent();
        const obj = new JsObject(event);
        // FIXME: This is ugly...
        engine.setSymbol(create_sym('e'), obj, nil);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '137.0');
        assert.strictEqual(is_flt(values[0]), true);
        engine.release();
    });
    it("bvalue", function () {
        const lines: string[] = [
            `(.. e -target -bvalue)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.ClojureScript });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const event = new FauxEvent();
        const obj = new JsObject(event);
        // FIXME: This is ugly...
        engine.setSymbol(create_sym('e'), obj, nil);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 1);
        assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), 'true');
        assert.strictEqual(is_boo(values[0]), true);
        engine.release();
    });
});