
import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { is_str } from "../src/operators/str/is_str";
import { ts_parse } from "../src/parser/ts_parse";
import { transform_tree } from "../src/runtime/execute";
import { create_engine } from "../src/runtime/symengine";
import { assert_one_value } from "./assert_one_value";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("parser", function () {
    it("should be able to parse a user symbol", function () {
        const lines: string[] = [
            `x`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "x");

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "x");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_sexpr(value, $), "x");
        engine.release();
    });
    it("should be able to parse a Rat", function () {
        const lines: string[] = [
            `12345`
        ];
        const engine = create_engine({ version: 2 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "12345");

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "12345");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_sexpr(value, $), "12345");
        engine.release();
    });
    it("should be able to parse a Flt", function () {
        const lines: string[] = [
            `12345.0`
        ];
        const engine = create_engine({
            dependencies: ['Flt'],
            version: 2
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), "12345.0", "A");

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "12345.0", "B");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_sexpr(value, $), "12345.0", "C");
        engine.release();
    });
    it("should be able to parse a Str", function () {
        const lines: string[] = [
            `"Hello"`
        ];
        const engine = create_engine({ version: 2 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // The result here would be different in version 1.x
        assert.strictEqual(render_as_sexpr(actual, $), '"Hello"');
        assert.isTrue(is_str(actual));
        if (is_str(actual)) {
            assert.strictEqual(actual.str, 'Hello');
        }

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.isTrue(is_str(tree));
        if (is_str(tree)) {
            assert.strictEqual(tree.str, 'Hello');
        }
        assert.strictEqual(render_as_sexpr(tree, $), '"Hello"');
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_sexpr(value, $), '"Hello"');
        engine.release();
    });
    it("should be able to parse a Str", function () {
        const lines: string[] = [
            `"Hello"`
        ];
        const engine = create_engine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // The result here would be different in version 1.x
        assert.strictEqual(render_as_sexpr(actual, $), '"Hello"');
        assert.isTrue(is_str(actual));
        if (is_str(actual)) {
            assert.strictEqual(actual.str, 'Hello');
        }

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.isTrue(is_str(tree));
        if (is_str(tree)) {
            assert.strictEqual(tree.str, 'Hello');
        }
        assert.strictEqual(render_as_sexpr(tree, $), '"Hello"');
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_sexpr(value, $), '"Hello"');
        engine.release();
    });
    it("should be able to parse an additive (+) expression", function () {
        const lines: string[] = [
            `a+b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(+ a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_infix(value, $), "a+b");
        engine.release();
    });
    it("should be able to parse an additive (-) expression", function () {
        const lines: string[] = [
            `a-b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(- a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a-b");
        engine.release();
    });
    it("should be able to parse an multiplicative (*) expression", function () {
        const lines: string[] = [
            `a*b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(* a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_infix(value, $), "a*b");
        engine.release();
    });
    it("should be able to parse an multiplicative (/) expression", function () {
        const lines: string[] = [
            `a/b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(/ a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a*b");
        engine.release();
    });
    it("should be able to parse an inner product (|) expression", function () {
        const lines: string[] = [
            `a|b`
        ];

        const engine = create_engine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(| a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_infix(value, $), "a|b");
        engine.release();
    });
    it("should be able to parse an outer product (^) expression", function () {
        const lines: string[] = [
            `a^b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(outer a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_infix(value, $), "a^b");
        engine.release();
    });
    it("should be able to parse a left contraction(<<) expression", function () {
        const lines: string[] = [
            `a<<b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(<< a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a<<b");
        engine.release();
    });
    it("should be able to parse a right contraction(>>) expression", function () {
        const lines: string[] = [
            `a>>b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(>> a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a<<b");
        engine.release();
    });
    it("should be able to parse an exponentiation (**) expression", function () {
        const lines: string[] = [
            `a**b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(power a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(render_as_infix(value, $), "a**b");
        engine.release();
    });
    it("should be able to parse an assignment expression", function () {
        const lines: string[] = [
            `x = 3`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(= x 3)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    it("should be able to parse a let expression", function () {
        const lines: string[] = [
            `let a: A`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(: a A)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    it("should be able to parse a let expression with assignment", function () {
        const lines: string[] = [
            `let a: Real = b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(= (: a Real) b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    it("should be able to parse a let expression with assignment", function () {
        const lines: string[] = [
            `let a: Complex = b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(= (: a Complex) b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    it("should be able to parse a let expression with assignment", function () {
        const lines: string[] = [
            `let a: Vec = b`
        ];

        const engine = create_engine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(render_as_sexpr(tree, $), "(= (: a Vec) b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
});
