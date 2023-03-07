
import { assert } from "chai";
import { is_sym } from "../src/operators/sym/is_sym";
import { create_script_context } from "../src/runtime/script_engine";
import { scheme_parse } from "../src/scheme/scheme_parse";
import { create_sym } from "../src/tree/sym/Sym";
import { is_cons } from "../src/tree/tree";

describe("scm-parse", function () {
    it('(quote "Hello")', function () {
        const lines: string[] = [
            `(quote "Hello")`
        ];

        const engine = create_script_context({});

        const { trees } = scheme_parse('foo.ts', lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), '(quote "Hello")');
        engine.release();
    });
    it('(real? 1901)', function () {
        const lines: string[] = [
            `(real? 1901)`
        ];

        const engine = create_script_context({});

        const { trees } = scheme_parse('foo.ts', lines.join('\n'));
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), '(real? 1901)');
        engine.release();
    });
    it("'obj", function () {
        const lines: string[] = [
            "'obj"
        ];

        const engine = create_script_context({});

        const QUOTE = create_sym("scm.quote");
        const { trees } = scheme_parse('foo.ts', lines.join('\n'), {
            lexicon: { 'quote': QUOTE }
        });
        assert.isArray(trees);
        assert.strictEqual(trees.length, 1);
        const tree = trees[0];
        assert.isDefined(tree);
        assert.strictEqual(engine.renderAsSExpr(tree), '(scm.quote obj)');
        if (is_cons(tree)) {
            const procedure = tree.opr;
            if (is_sym(procedure)) {
                if (procedure.equalsSym(QUOTE)) {
                    // 
                }
                else {
                    assert.fail("quote is not being recognized as QUOTE");
                }
            }
            else {
                assert.fail();
            }
        }
        else {
            assert.fail();
        }
        engine.release();
    });
});
