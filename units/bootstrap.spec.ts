import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("A bootstrap", function () {
    it("a*b", function () {
        const lines: string[] = [
            `autofactor=1`,
            `a*b`
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "a*b");

        engine.release();
    });
    it("a*b expanding only", function () {
        const lines: string[] = [
            `autofactor=0`,
            `a*b`
        ];
        const engine = createSymEngine({ treatAsVectors: ['a', 'b'] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "a*b");

        engine.release();
    });
    it("b*a expanding only", function () {
        const lines: string[] = [
            `autofactor=0`,
            `b*a`
        ];
        const engine = createSymEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "b*a");

        engine.release();
    });
    it("a|b+a^b expanding only", function () {
        const lines: string[] = [
            `autofactor=1`,
            `a|b+a^b`
        ];
        const engine = createSymEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "a*b");

        engine.release();
    });
    it("a|b-a^b expanding only", function () {
        const lines: string[] = [
            `autofactor=1`,
            `a|b-a^b`
        ];
        const engine = createSymEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "b*a");

        engine.release();
    });
});

describe("B bootstrap", function () {
    it("2*0", function () {
        const lines: string[] = [
            `2*0`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "0");
        assert.strictEqual(print_expr(actual, $), "0");
        engine.release();
    });
    it("x+x", function () {
        const lines: string[] = [
            `2*x`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* 2 x)");
        assert.strictEqual(print_expr(actual, $), "2*x");
        engine.release();
    });
    it("x-x", function () {
        const lines: string[] = [
            `x-x`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "0");
        assert.strictEqual(print_expr(actual, $), "0");
        engine.release();
    });
});

describe("C bootstrap", function () {
    it("createSymEngine and release", function () {
        const engine = createSymEngine();
        try {
            assert.isDefined(engine);
        }
        finally {
            engine.release();
        }
    });
    it("a", function () {
        const lines: string[] = [
            `a`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "a");
        assert.strictEqual(print_expr(actual, $), "a");
        engine.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");
        engine.release();
    });
    it("b+a", function () {
        const lines: string[] = [
            `b+a`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a b)");
        assert.strictEqual(print_expr(actual, $), "a+b");
        engine.release();
    });
    it("a*b commutes by default because unbound symbols are treated as real numbers.", function () {
        const lines: string[] = [
            `a*b`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* a b)");
        assert.strictEqual(print_expr(actual, $), "a*b");
        engine.release();
    });
    it("b*a does not commute when a and b are treated as vectors.", function () {
        const lines: string[] = [
            `b*a`
        ];
        const engine = createSymEngine({
            dependencies: ['Vector'],
            treatAsVectors: ['a', 'b']
        });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(* b a)");
        assert.strictEqual(print_expr(actual, $), "b*a");
        engine.release();
    });
    it("Sym - Sym", function () {
        const lines: string[] = [
            `a-b`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a (* -1 b))");
        assert.strictEqual(print_expr(actual, $), "a-b");
        engine.release();
    });
    describe("Sym + Sym + Sym", function () {
        it("a+b+c", function () {
            const lines: string[] = [
                `a+b+c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("a+c+b", function () {
            const lines: string[] = [
                `a+c+b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("b+a+c", function () {
            const lines: string[] = [
                `b+a+c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("b+c+a", function () {
            const lines: string[] = [
                `b+c+a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("c+b+a", function () {
            const lines: string[] = [
                `c+b+a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("c+a+b", function () {
            const lines: string[] = [
                `c+a+b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        // Force grouping on RHS
        it("a+(b+c)", function () {
            const lines: string[] = [
                `a+(b+c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("a+(c+b)", function () {
            const lines: string[] = [
                `a+(c+b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("b+(a+c)", function () {
            const lines: string[] = [
                `b+(a+c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("b+(c+a)", function () {
            const lines: string[] = [
                `b+(c+a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("c+(b+a)", function () {
            const lines: string[] = [
                `c+(b+a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
        it("c+(a+b)", function () {
            const lines: string[] = [
                `c+(a+b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c)");
            assert.strictEqual(print_expr(actual, $), "a+b+c");

            engine.release();
        });
    });
    describe("Sym * Sym * Sym", function () {
        it("a*b*c", function () {
            const lines: string[] = [
                `a*b*c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("a*c*b", function () {
            const lines: string[] = [
                `a*c*b`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("b*a*c", function () {
            const lines: string[] = [
                `b*a*c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("b*c*a", function () {
            const lines: string[] = [
                `b*c*a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("c*b*a", function () {
            const lines: string[] = [
                `c*b*a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("c*a*b", function () {
            const lines: string[] = [
                `c*a*b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        // Force grouping on RHS
        it("a*(b*c)", function () {
            const lines: string[] = [
                `a*(b*c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("a*(c*b)", function () {
            const lines: string[] = [
                `a*(c*b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("b*(a*c)", function () {
            const lines: string[] = [
                `b*(a*c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("b*(c*a)", function () {
            const lines: string[] = [
                `b*(c*a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("c*(b*a)", function () {
            const lines: string[] = [
                `c*(b*a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        it("c*(a*b)", function () {
            const lines: string[] = [
                `c*(a*b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
    });
    describe("Sym * Sym + Sym", function () {
        it("a*b+c", function () {
            const lines: string[] = [
                `a*b+c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        it("a*c+b", function () {
            const lines: string[] = [
                `a*c+b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a c) b)");
            assert.strictEqual(print_expr(actual, $), "a*c+b");

            engine.release();
        });
        it("b*a+c", function () {
            const lines: string[] = [
                `b*a+c`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        it("b*c+a", function () {
            const lines: string[] = [
                `b*c+a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* b c))");
            assert.strictEqual(print_expr(actual, $), "a+b*c");

            engine.release();
        });
        it("c*b+a", function () {
            const lines: string[] = [
                `c*b+a`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* b c))");
            assert.strictEqual(print_expr(actual, $), "a+b*c");

            engine.release();
        });
        it("c*a*b", function () {
            const lines: string[] = [
                `c*a*b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* a b c)");
            assert.strictEqual(print_expr(actual, $), "a*b*c");

            engine.release();
        });
        // Force grouping on RHS
        it("a*(b+c)", function () {
            const lines: string[] = [
                `a*(b+c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* a c))");
            // assert.strictEqual(print_expr(actual, $), "a*b+a*c");
            assert.strictEqual(print_expr(actual, $), "a*(b+c)");

            engine.release();
        });
        it("a*(c+b)", function () {
            const lines: string[] = [
                `a*(c+b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* a c))");
            // assert.strictEqual(print_expr(actual, $), "a*b+a*c");
            assert.strictEqual(print_expr(actual, $), "a*(b+c)");

            engine.release();
        });
        it("b*(a+c)", function () {
            const lines: string[] = [
                `b*(a+c)`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) (* b c))");
            assert.strictEqual(print_expr(actual, $), "a*b+b*c");

            engine.release();
        });
        // This no longer factorizes because canonicalization creates (a*b)+(b*c).
        // THis could be factorized to the left or right with appropriate conditions on a,b,c.
        it("b*(c+a)", function () {
            const lines: string[] = [
                `autofactor=1`,
                `b*(c+a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* b c))");
            assert.strictEqual(print_expr(actual, $), "a*b+b*c");
            // assert.strictEqual(print_expr(actual, $), "b*(a+c)");

            engine.release();
        });
        // c*(b+a) => c*(a+b) => (c*a)+(c*b) => (a*c)+(b*c) => (a+b)*c 
        it("c*(b+a)", function () {
            const lines: string[] = [
                `c*(b+a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a c) (* b c))");
            // assert.strictEqual(print_expr(actual, $), "a*c+b*c");
            assert.strictEqual(print_expr(actual, $), "(a+b)*c");

            engine.release();
        });
        it("c*(a+b)", function () {
            const lines: string[] = [
                `c*(a+b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a c) (* b c))");
            // assert.strictEqual(print_expr(actual, $), "a*c+b*c");
            assert.strictEqual(print_expr(actual, $), "(a+b)*c");

            engine.release();
        });
    });
    describe("Sym + Sym * Sym", function () {
        it("a+b*c", function () {
            const lines: string[] = [
                `a+b*c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* b c))");
            assert.strictEqual(print_expr(actual, $), "a+b*c");

            engine.release();
        });
        it("a+c*b", function () {
            const lines: string[] = [
                `a+c*b`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* b c))");
            assert.strictEqual(print_expr(actual, $), "a+b*c");

            engine.release();
        });
        it("b+a*c", function () {
            const lines: string[] = [
                `b+a*c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ b (* a c))");
            assert.strictEqual(print_expr(actual, $), "b+a*c");

            engine.release();
        });
        it("b+c*a", function () {
            const lines: string[] = [
                `b+c*a`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ b (* a c))");
            assert.strictEqual(print_expr(actual, $), "b+a*c");

            engine.release();
        });
        it("c+b*a", function () {
            const lines: string[] = [
                `c+b*a`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        it("c+a*b", function () {
            const lines: string[] = [
                `c+a*b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        // Force grouping on RHS
        it("c+(a*b)", function () {
            const lines: string[] = [
                `c+(a*b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        it("a+(c*b)", function () {
            const lines: string[] = [
                `a+(c*b)`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* b c))");
            assert.strictEqual(print_expr(actual, $), "a+b*c");

            engine.release();
        });
        it("b+(a*c)", function () {
            const lines: string[] = [
                `b+(a*c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ b (* a c))");
            assert.strictEqual(print_expr(actual, $), "b+a*c");

            engine.release();
        });
        it("b+(c*a)", function () {
            const lines: string[] = [
                `b+(c*a)`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ b (* a c))");
            assert.strictEqual(print_expr(actual, $), "b+a*c");

            engine.release();
        });
        it("c+(b*a)", function () {
            const lines: string[] = [
                `c+(b*a)`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        it("c+(a*b)", function () {
            const lines: string[] = [
                `c+(a*b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) c)");
            assert.strictEqual(print_expr(actual, $), "a*b+c");

            engine.release();
        });
        // Force grouping on LHS
        // (c+a)*b => (a+c)*b => a*b+c*b => a*b+b*c
        it("(c+a)*b", function () {
            const lines: string[] = [
                `(c+a)*b`
            ];
            const engine = createSymEngine({ treatAsVectors: ['a', 'b'] });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) (* b c))");
            assert.strictEqual(print_expr(actual, $), "a*b+b*c");

            engine.release();
        });
        it("(a+c)*b", function () {
            const lines: string[] = [
                `(a+c)*b`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) (* b c))");
            assert.strictEqual(print_expr(actual, $), "a*b+b*c");

            engine.release();
        });
        it("(b+a)*c", function () {
            const lines: string[] = [
                `(b+a)*c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a c) (* b c))");
            // assert.strictEqual(print_expr(actual, $), "a*c+b*c");
            // With factorization is a step...
            assert.strictEqual(print_expr(actual, $), "(a+b)*c");

            engine.release();
        });
        it("(b+c)*a", function () {
            const lines: string[] = [
                `(b+c)*a`
            ];
            const engine = createSymEngine({ treatAsVectors: ['b', 'c'] });
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* a c))");
            // assert.strictEqual(print_expr(actual, $), "a*b+a*c");
            // With factorization is a step...
            assert.strictEqual(print_expr(actual, $), "a*(b+c)");

            engine.release();
        });
        it("(c+b)*a", function () {
            const lines: string[] = [
                `(c+b)*a`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* a c))");
            // assert.strictEqual(print_expr(actual, $), "a*b+a*c");
            // With factorization is a step...
            assert.strictEqual(print_expr(actual, $), "a*(b+c)");

            engine.release();
        });
        it("(c+a)*b", function () {
            const lines: string[] = [
                `(c+a)*b`
            ];
            const engine = createSymEngine({});
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* a b) (* b c))");
            assert.strictEqual(print_expr(actual, $), "a*b+b*c");
            // TODO. Since c is a scalar, the second term could be reversed and the expression would factor out b on RHS.
            // Should we order Sym factors according to whether they are scalars?
            // Note that this would not work if a and b were scalars.
            engine.release();
        });
    });
    describe("Sym - Sym - Sym", function () {
        it("a-b-c", function () {
            const lines: string[] = [
                `a-b-c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* -1 b) (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "a-b-c");

            engine.release();
        });
        it("a-c-b", function () {
            const lines: string[] = [
                `a-c-b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* -1 b) (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "a-b-c");

            engine.release();
        });
        it("b-a-c", function () {
            const lines: string[] = [
                `b-a-c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "-a+b-c");

            engine.release();
        });
        it("b-c-a", function () {
            const lines: string[] = [
                `b-c-a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "-a+b-c");

            engine.release();
        });
        it("c-b-a", function () {
            const lines: string[] = [
                `c-b-a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* -1 a) (* -1 b) c)");
            assert.strictEqual(print_expr(actual, $), "-(a+b)+c");

            engine.release();
        });
        it("c-a-b", function () {
            const lines: string[] = [
                `c-a-b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* -1 a) (* -1 b) c)");
            assert.strictEqual(print_expr(actual, $), "-(a+b)+c");

            engine.release();
        });
        // Force grouping on RHS
        it("c-(a-b)", function () {
            const lines: string[] = [
                `c-(a-b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b c)");
            assert.strictEqual(print_expr(actual, $), "-a+b+c");

            engine.release();
        });
        it("a-(c-b)", function () {
            const lines: string[] = [
                `a-(c-b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "a+b-c");

            engine.release();
        });
        it("b-(a-c)", function () {
            const lines: string[] = [
                `b-(a-c)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b c)");
            assert.strictEqual(print_expr(actual, $), "-a+b+c");

            engine.release();
        });
        it("b-(c-a)", function () {
            const lines: string[] = [
                `b-(c-a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "a+b-c");

            engine.release();
        });
        it("c-(b-a)", function () {
            const lines: string[] = [
                `c-(b-a)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* -1 b) c)");
            assert.strictEqual(print_expr(actual, $), "a-b+c");

            engine.release();
        });
        it("c-(a-b)", function () {
            const lines: string[] = [
                `c-(a-b)`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b c)");
            assert.strictEqual(print_expr(actual, $), "-a+b+c");

            engine.release();
        });
        // Force grouping on LHS
        it("(c-a)-b", function () {
            const lines: string[] = [
                `(c-a)-b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* -1 a) (* -1 b) c)");
            assert.strictEqual(print_expr(actual, $), "-(a+b)+c");

            engine.release();
        });
        it("(a-c)-b", function () {
            const lines: string[] = [
                `(a-c)-b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a (* -1 b) (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "a-b-c");

            engine.release();
        });
        it("(b-a)-c", function () {
            const lines: string[] = [
                `(b-a)-c`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "-a+b-c");

            engine.release();
        });
        it("(b-c)-a", function () {
            const lines: string[] = [
                `(b-c)-a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(print_expr(actual, $), "-a+b-c");

            engine.release();
        });
        it("(c-b)-a", function () {
            const lines: string[] = [
                `(c-b)-a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* -1 a) (* -1 b) c)");
            assert.strictEqual(print_expr(actual, $), "-(a+b)+c");

            engine.release();
        });
        it("(c-a)-b", function () {
            const lines: string[] = [
                `(c-a)-b`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* -1 a) (* -1 b) c)");
            assert.strictEqual(print_expr(actual, $), "-(a+b)+c");

            engine.release();
        });
    });
    describe("misc", function () {
        it("a+b+c+d", function () {
            const lines: string[] = [
                `a+b+c+d`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c d)");
            assert.strictEqual(print_expr(actual, $), "a+b+c+d");

            engine.release();
        });
        it("a+b+c+d+e", function () {
            const lines: string[] = [
                `a+b+c+d+e`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(+ a b c d e)");
            assert.strictEqual(print_expr(actual, $), "a+b+c+d+e");

            engine.release();
        });
        it("-1**0", function () {
            const lines: string[] = [
                `-1**0`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "1");
            assert.strictEqual(print_expr(actual, $), "1");

            engine.release();
        });
    });
    describe("kernel-1", function () {
        it("x", function () {
            const lines: string[] = [
                `x`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "x");
            assert.strictEqual(print_expr(actual, $), "x");

            engine.release();
        });
        it("1*x", function () {
            const lines: string[] = [
                `1*x`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "x");
            assert.strictEqual(print_expr(actual, $), "x");

            engine.release();
        });
        it("2*x", function () {
            const lines: string[] = [
                `2*x`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* 2 x)");
            assert.strictEqual(print_expr(actual, $), "2*x");

            engine.release();
        });
        it("-2*x", function () {
            const lines: string[] = [
                `-2*x`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(* -2 x)");
            assert.strictEqual(print_expr(actual, $), "-2*x");

            engine.release();
        });
        it("a*a", function () {
            const lines: string[] = [
                `a*a`
            ];
            const engine = createSymEngine();
            const $ = engine.$;
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(print_list(actual, $), "(power a 2)");
            assert.strictEqual(print_expr(actual, $), "a**2");

            engine.release();
        });
    });
});
