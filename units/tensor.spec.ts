import { assert } from "chai";
import { get_component } from "../src/calculators/get_component";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { integer } from "../src/tree/rat/Rat";
import { Sym } from "../src/tree/sym/Sym";
import { Tensor } from "../src/tree/tensor/Tensor";
import { makeList } from "../src/tree/tree";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("tensor-sandbox", function () {
    it("det", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(print_expr(actual, $), "a*d-b*c");
        engine.release();
    });
});

describe("tensor", function () {
    it("sanity-check", function () {
        const engine = createSymEngine();
        const $ = engine.$;
        const a = new Sym('a');
        const b = new Sym('b');
        const c = new Sym('c');
        const d = new Sym('d');
        const e = new Sym('e');
        const f = new Sym('f');
        const ab = new Tensor([2], [a, b]);
        const cd = new Tensor([2], [c, d]);
        const ef = new Tensor([2], [e, f]);
        const M = new Tensor([3, 2], [a, b, c, d, e, f]);
        assert.strictEqual(M.ndim, 2);
        assert.strictEqual(M.dim(0), 3);
        assert.strictEqual(M.dim(1), 2);
        assert.isTrue(get_component(ab, makeList(integer(1)), $).equals(a));
        assert.isTrue(get_component(ab, makeList(integer(2)), $).equals(b));
        assert.isTrue(get_component(cd, makeList(integer(1)), $).equals(c));
        assert.isTrue(get_component(cd, makeList(integer(2)), $).equals(d));
        assert.isTrue(get_component(ef, makeList(integer(1)), $).equals(e));
        assert.isTrue(get_component(ef, makeList(integer(2)), $).equals(f));
        assert.isTrue(get_component(M, makeList(), $).equals(M));
        assert.isTrue(get_component(M, makeList(integer(1)), $).equals(ab));
        assert.isTrue(get_component(M, makeList(integer(2)), $).equals(cd));
        assert.isTrue(get_component(M, makeList(integer(3)), $).equals(ef));
        assert.isTrue(get_component(M, makeList(integer(1), integer(1)), $).equals(a));
        assert.isTrue(get_component(M, makeList(integer(1), integer(2)), $).equals(b));
        assert.isTrue(get_component(M, makeList(integer(2), integer(1)), $).equals(c));
        assert.isTrue(get_component(M, makeList(integer(2), integer(2)), $).equals(d));
        assert.isTrue(get_component(M, makeList(integer(3), integer(1)), $).equals(e));
        assert.isTrue(get_component(M, makeList(integer(3), integer(2)), $).equals(f));
    });
    it("printing", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `A`
        ];
        const sourceText = lines.join('\n');
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(print_list(actual, $), "[[a,b],[c,d]]");
        assert.strictEqual(print_expr(actual, $), "[[a,b],[c,d]]");

        engine.release();
    });
    describe("index", function () {
        it("A[]", function () {
            // TODO: The scanner does not allow
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_list(actual, $), "[[a,b],[c,d]]");
            assert.strictEqual(print_expr(actual, $), "[[a,b],[c,d]]");
            engine.release();
        });
        it("A[1]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[1]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_expr(actual, $), "[a,b]");
            engine.release();
        });
        it("A[2]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[2]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_expr(actual, $), "[c,d]");
            engine.release();
        });
        it("A[1,1]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[1,1]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_expr(actual, $), "a");
            engine.release();
        });
        it("A[1,2]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[1,2]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_expr(actual, $), "b");
            engine.release();
        });
        it("A[2,1]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[2,1]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_expr(actual, $), "c");
            engine.release();
        });
        it("A[2,2]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[2,2]`
            ];
            const sourceText = lines.join('\n');
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(print_expr(actual, $), "d");
            engine.release();
        });
    });
    it("adj", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `adj(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(print_expr(actual, $), "[[d,-b],[-c,a]]");
        engine.release();
    });
    it("det", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(print_expr(actual, $), "a*d-b*c");
        engine.release();
    });
    it("inv", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(print_expr(actual, $), "[[d,-b],[-c,a]]/(a*d-b*c)");
        engine.release();
    });
    it("inv-adj/det", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `inv(A)-adj(A)/det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(print_expr(actual, $), "0");
        engine.release();
    });
});
