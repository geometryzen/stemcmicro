
import { assert } from "chai";
import { ts_parse } from "../src/parser/ts_parse";
import { print_expr, print_list } from "../src/print";
import { transform_tree } from "../src/runtime/execute";
import { createSymEngine } from "../src/runtime/symengine";
import { is_str } from "../src/tree/str/is_str";
import { assert_one_value } from "./assert_one_value";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("parser", function () {
    it("should be able to parse a user symbol", function () {
        const lines: string[] = [
            `x`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "x");

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "x");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_list(value, $), "x");
        engine.release();
    });
    it("should be able to parse a Rat", function () {
        const lines: string[] = [
            `12345`
        ];
        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "12345");

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "12345");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_list(value, $), "12345");
        engine.release();
    });
    it("should be able to parse a Flt", function () {
        const lines: string[] = [
            `12345.0`
        ];
        const engine = createSymEngine({
            dependencies: ['Flt'],
            version: 2
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "12345.0", "A");

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "12345.0", "B");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_list(value, $), "12345.0", "C");
        engine.release();
    });
    it("should be able to parse a Str", function () {
        const lines: string[] = [
            `"Hello"`
        ];
        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // The result here would be different in version 1.x
        assert.strictEqual(print_list(actual, $), '"Hello"');
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
        assert.strictEqual(print_list(tree, $), '"Hello"');
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_list(value, $), '"Hello"');
        engine.release();
    });
    it("should be able to parse a Str", function () {
        const lines: string[] = [
            `"Hello"`
        ];
        const engine = createSymEngine({ version: 1 });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // The result here would be different in version 1.x
        assert.strictEqual(print_list(actual, $), '"Hello"');
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
        assert.strictEqual(print_list(tree, $), '"Hello"');
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_list(value, $), '"Hello"');
        engine.release();
    });
    it("should be able to parse an additive (+) expression", function () {
        const lines: string[] = [
            `a+b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(+ a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_expr(value, $), "a+b");
        engine.release();
    });
    xit("should be able to parse an additive (-) expression", function () {
        const lines: string[] = [
            `a-b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(- a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a-b");
        engine.release();
    });
    it("should be able to parse an multiplicative (*) expression", function () {
        const lines: string[] = [
            `a*b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(* a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_expr(value, $), "a*b");
        engine.release();
    });
    xit("should be able to parse an multiplicative (/) expression", function () {
        const lines: string[] = [
            `a/b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(/ a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a*b");
        engine.release();
    });
    it("should be able to parse an inner product (|) expression", function () {
        const lines: string[] = [
            `a|b`
        ];

        const engine = createSymEngine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(| a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_expr(value, $), "a|b");
        engine.release();
    });
    it("should be able to parse an outer product (^) expression", function () {
        const lines: string[] = [
            `a^b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(^ a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_expr(value, $), "a^b");
        engine.release();
    });
    it("should be able to parse a left contraction(<<) expression", function () {
        const lines: string[] = [
            `a<<b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(<< a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a<<b");
        engine.release();
    });
    it("should be able to parse a right contraction(>>) expression", function () {
        const lines: string[] = [
            `a>>b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(>> a b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "a<<b");
        engine.release();
    });
    it("should be able to parse an exponentiation (**) expression", function () {
        const lines: string[] = [
            `a**b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(power a b)");
        const value = assert_one_value(transform_tree(tree, $));
        assert.strictEqual(print_expr(value, $), "a**b");
        engine.release();
    });
    it("should be able to parse an assignment expression", function () {
        const lines: string[] = [
            `x = 3`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(= x 3)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    xit("should be able to parse a let expression", function () {
        const lines: string[] = [
            `let a: A`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(: a A)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    xit("should be able to parse a let expression with assignment", function () {
        const lines: string[] = [
            `let a: Real = b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(= (: a Real) b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    xit("should be able to parse a let expression with assignment", function () {
        const lines: string[] = [
            `let a: Complex = b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(= (: a Complex) b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
    xit("should be able to parse a let expression with assignment", function () {
        const lines: string[] = [
            `let a: Vec = b`
        ];

        const engine = createSymEngine({ version: 2 });
        const $ = engine.$;

        const tree = ts_parse('foo.ts', lines.join('\n'));
        assert.isDefined(tree);
        assert.strictEqual(print_list(tree, $), "(= (: a Vec) b)");
        // const value = assert_one_value(evaluate_tree(tree, $));
        // assert.strictEqual(print_expr(value,$), "x=3");
        engine.release();
    });
});
