
import { assert } from "chai";
import { assert_keyword, assert_map, assert_rat } from "math-expression-atoms";
import { create_engine, ExprEngine } from "../src/api/index";
import { SyntaxKind } from "../src/parser/parser";

describe("Algebrite", function () {
    it("empty Map", function () {
        const lines: string[] = [
            `{}`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        try {
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);
            const map = assert_map(trees[0]);
            assert.strictEqual(map.entries.length, 0);
            assert.strictEqual(map.pos, 0, "pos");
            assert.strictEqual(map.end, 2, "end");
        }
        finally {
            engine.release();
        }
    });
    it("Map", function () {
        const lines: string[] = [
            `{a: 1, b: 2}`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        try {
            const { trees, errors } = engine.parse(sourceText, {});
            assert.strictEqual(errors.length, 0);
            assert.strictEqual(trees.length, 1);
            const map = assert_map(trees[0]);
            assert.strictEqual(map.entries.length, 2);
            assert.strictEqual(map.pos, 0, "pos");
            assert.strictEqual(map.end, 12, "end");

            const one = map.entries[0];
            const a = assert_keyword(one[0]);
            assert.strictEqual(a.localName, "a");
            const r = assert_rat(one[1]);
            assert.strictEqual(r.isOne(), true);

            const two = map.entries[1];
            const b = assert_keyword(two[0]);
            assert.strictEqual(b.localName, "b");
            const s = assert_rat(two[1]);
            assert.strictEqual(s.isTwo(), true);
        }
        finally {
            engine.release();
        }
    });
});