import { assert } from "chai";
import { createScriptEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("B bootstrap", function () {
    it("2*0", function () {
        const lines: string[] = [
            `2*0`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "0");
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("x+x", function () {
        const lines: string[] = [
            `2*x`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* 2 x)");
        assert.strictEqual(engine.renderAsInfix(actual), "2*x");
        engine.release();
    });
    it("x-x", function () {
        const lines: string[] = [
            `x-x`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "0");
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
});

describe("C bootstrap", function () {
    it("createSymEngine and release", function () {
        const engine = createScriptEngine();
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
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "a");
        assert.strictEqual(engine.renderAsInfix(actual), "a");
        engine.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b");
        engine.release();
    });
    it("b+a", function () {
        const lines: string[] = [
            `b+a`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+b");
        engine.release();
    });
    it("a*b commutes by default because unbound symbols are treated as real numbers.", function () {
        const lines: string[] = [
            `a*b`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(* a b)");
        assert.strictEqual(engine.renderAsInfix(actual), "a*b");
        engine.release();
    });
    it("Sym - Sym", function () {
        const lines: string[] = [
            `a-b`
        ];
        const engine = createScriptEngine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* -1 b))");
        assert.strictEqual(engine.renderAsInfix(actual), "a-b");
        engine.release();
    });
    describe("Sym + Sym + Sym", function () {
        it("a+b+c", function () {
            const lines: string[] = [
                `a+b+c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("a+c+b", function () {
            const lines: string[] = [
                `a+c+b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("b+a+c", function () {
            const lines: string[] = [
                `b+a+c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("b+c+a", function () {
            const lines: string[] = [
                `b+c+a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("c+b+a", function () {
            const lines: string[] = [
                `c+b+a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("c+a+b", function () {
            const lines: string[] = [
                `c+a+b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        // Force grouping on RHS
        it("a+(b+c)", function () {
            const lines: string[] = [
                `a+(b+c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("a+(c+b)", function () {
            const lines: string[] = [
                `a+(c+b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("b+(a+c)", function () {
            const lines: string[] = [
                `b+(a+c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("b+(c+a)", function () {
            const lines: string[] = [
                `b+(c+a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("c+(b+a)", function () {
            const lines: string[] = [
                `c+(b+a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
        it("c+(a+b)", function () {
            const lines: string[] = [
                `c+(a+b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c");

            engine.release();
        });
    });
    describe("Sym * Sym * Sym", function () {
        it("a*b*c", function () {
            const lines: string[] = [
                `a*b*c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("a*c*b", function () {
            const lines: string[] = [
                `a*c*b`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("b*a*c", function () {
            const lines: string[] = [
                `b*a*c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("b*c*a", function () {
            const lines: string[] = [
                `b*c*a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("c*b*a", function () {
            const lines: string[] = [
                `c*b*a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("c*a*b", function () {
            const lines: string[] = [
                `c*a*b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        // Force grouping on RHS
        it("a*(b*c)", function () {
            const lines: string[] = [
                `a*(b*c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("a*(c*b)", function () {
            const lines: string[] = [
                `a*(c*b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("b*(a*c)", function () {
            const lines: string[] = [
                `b*(a*c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("b*(c*a)", function () {
            const lines: string[] = [
                `b*(c*a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("c*(b*a)", function () {
            const lines: string[] = [
                `c*(b*a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        it("c*(a*b)", function () {
            const lines: string[] = [
                `c*(a*b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
    });
    describe("Sym * Sym + Sym", function () {
        it("a*b+c", function () {
            const lines: string[] = [
                `a*b+c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        it("a*c+b", function () {
            const lines: string[] = [
                `a*c+b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "b+a*c");

            engine.release();
        });
        it("b*a+c", function () {
            const lines: string[] = [
                `b*a+c`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        it("b*c+a", function () {
            const lines: string[] = [
                `b*c+a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

            engine.release();
        });
        it("c*b+a", function () {
            const lines: string[] = [
                `c*b+a`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

            engine.release();
        });
        it("c*a*b", function () {
            const lines: string[] = [
                `c*a*b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* a b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b*c");

            engine.release();
        });
        // Force grouping on RHS
        it("a*(b+c)", function () {
            const lines: string[] = [
                `a*(b+c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+a*c");

            engine.release();
        });
        it("a*(c+b)", function () {
            const lines: string[] = [
                `a*(c+b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+a*c");

            engine.release();
        });
        it("b*(a+c)", function () {
            const lines: string[] = [
                `b*(a+c)`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* a b) (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+b*c");

            engine.release();
        });
        // This no longer factorizes because canonicalization creates (a*b)+(b*c).
        // THis could be factorized to the left or right with appropriate conditions on a,b,c.
        it("b*(c+a)", function () {
            const lines: string[] = [
                `b*(c+a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(print_list(actual, $), "(+ (* a b) (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+b*c");
            // assert.strictEqual(print_expr(actual, $), "b*(a+c)");

            engine.release();
        });
        it("c*(b+a)", function () {
            const lines: string[] = [
                `c*(b+a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a*c+b*c");

            engine.release();
        });
        it("c*(a+b)", function () {
            const lines: string[] = [
                `c*(a+b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a*c+b*c");

            engine.release();
        });
    });
    describe("Sym + Sym * Sym", function () {
        it("a+b*c", function () {
            const lines: string[] = [
                `a+b*c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

            engine.release();
        });
        it("a+c*b", function () {
            const lines: string[] = [
                `a+c*b`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

            engine.release();
        });
        it("b+a*c", function () {
            const lines: string[] = [
                `b+a*c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ b (* a c))");
            assert.strictEqual(engine.renderAsInfix(actual), "b+a*c");

            engine.release();
        });
        it("b+c*a", function () {
            const lines: string[] = [
                `b+c*a`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ b (* a c))");
            assert.strictEqual(engine.renderAsInfix(actual), "b+a*c");

            engine.release();
        });
        it("c+b*a", function () {
            const lines: string[] = [
                `c+b*a`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        it("c+a*b", function () {
            const lines: string[] = [
                `c+a*b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        // Force grouping on RHS
        it("c+(a*b)", function () {
            const lines: string[] = [
                `c+(a*b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        it("a+(c*b)", function () {
            const lines: string[] = [
                `a+(c*b)`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b*c");

            engine.release();
        });
        it("b+(a*c)", function () {
            const lines: string[] = [
                `b+(a*c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ b (* a c))");
            assert.strictEqual(engine.renderAsInfix(actual), "b+a*c");

            engine.release();
        });
        it("b+(c*a)", function () {
            const lines: string[] = [
                `b+(c*a)`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ b (* a c))");
            assert.strictEqual(engine.renderAsInfix(actual), "b+a*c");

            engine.release();
        });
        it("c+(b*a)", function () {
            const lines: string[] = [
                `c+(b*a)`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        it("c+(a*b)", function () {
            const lines: string[] = [
                `c+(a*b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c+a*b");

            engine.release();
        });
        // Force grouping on LHS
        it("(a+c)*b", function () {
            const lines: string[] = [
                `(a+c)*b`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* a b) (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+b*c");

            engine.release();
        });
        it("(b+a)*c", function () {
            const lines: string[] = [
                `(b+a)*c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a*c+b*c");
            engine.release();
        });
        it("(c+b)*a", function () {
            const lines: string[] = [
                `(c+b)*a`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+a*c");

            engine.release();
        });
        it("(c+a)*b", function () {
            const lines: string[] = [
                `(c+a)*b`
            ];
            const engine = createScriptEngine({});
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* a b) (* b c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a*b+b*c");
            engine.release();
        });
    });
    describe("Sym - Sym - Sym", function () {
        it("a-b-c", function () {
            const lines: string[] = [
                `a-b-c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* -1 b) (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a-b-c");

            engine.release();
        });
        it("a-c-b", function () {
            const lines: string[] = [
                `a-c-b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* -1 b) (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a-b-c");

            engine.release();
        });
        it("b-a-c", function () {
            const lines: string[] = [
                `b-a-c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b-c");

            engine.release();
        });
        it("b-c-a", function () {
            const lines: string[] = [
                `b-c-a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b-c");

            engine.release();
        });
        it("c-b-a", function () {
            const lines: string[] = [
                `c-b-a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "-a-b+c");
            engine.release();
        });
        it("c-a-b", function () {
            const lines: string[] = [
                `c-a-b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "-a-b+c");
            engine.release();
        });
        // Force grouping on RHS
        it("c-(a-b)", function () {
            const lines: string[] = [
                `c-(a-b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            // assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b+c");

            engine.release();
        });
        it("a-(c-b)", function () {
            const lines: string[] = [
                `a-(c-b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b-c");

            engine.release();
        });
        it("b-(a-c)", function () {
            const lines: string[] = [
                `b-(a-c)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b+c");

            engine.release();
        });
        it("b-(c-a)", function () {
            const lines: string[] = [
                `b-(c-a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b-c");

            engine.release();
        });
        it("c-(b-a)", function () {
            const lines: string[] = [
                `c-(b-a)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* -1 b) c)");
            assert.strictEqual(engine.renderAsInfix(actual), "a-b+c");

            engine.release();
        });
        it("c-(a-b)", function () {
            const lines: string[] = [
                `c-(a-b)`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b c)");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b+c");

            engine.release();
        });
        // Force grouping on LHS
        it("(c-a)-b", function () {
            const lines: string[] = [
                `(c-a)-b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "-a-b+c");
            engine.release();
        });
        it("(a-c)-b", function () {
            const lines: string[] = [
                `(a-c)-b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a (* -1 b) (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "a-b-c");

            engine.release();
        });
        it("(b-a)-c", function () {
            const lines: string[] = [
                `(b-a)-c`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b-c");

            engine.release();
        });
        it("(b-c)-a", function () {
            const lines: string[] = [
                `(b-c)-a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ (* -1 a) b (* -1 c))");
            assert.strictEqual(engine.renderAsInfix(actual), "-a+b-c");

            engine.release();
        });
        it("(c-b)-a", function () {
            const lines: string[] = [
                `(c-b)-a`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "-a-b+c");
            engine.release();
        });
        it("(c-a)-b", function () {
            const lines: string[] = [
                `(c-a)-b`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(actual), "-a-b+c");
            engine.release();
        });
    });
    describe("misc", function () {
        it("a+b+c+d", function () {
            const lines: string[] = [
                `a+b+c+d`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c d)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c+d");
            engine.release();
        });
        it("a+b+c+d+e", function () {
            const lines: string[] = [
                `a+b+c+d+e`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(+ a b c d e)");
            assert.strictEqual(engine.renderAsInfix(actual), "a+b+c+d+e");

            engine.release();
        });
        it("-1**0", function () {
            const lines: string[] = [
                `-1**0`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "1");
            assert.strictEqual(engine.renderAsInfix(actual), "1");
            engine.release();
        });
    });
    describe("kernel-1", function () {
        it("x", function () {
            const lines: string[] = [
                `x`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "x");
            assert.strictEqual(engine.renderAsInfix(actual), "x");
            engine.release();
        });
        it("1*x", function () {
            const lines: string[] = [
                `1*x`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "x");
            assert.strictEqual(engine.renderAsInfix(actual), "x");
            engine.release();
        });
        it("2*x", function () {
            const lines: string[] = [
                `2*x`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* 2 x)");
            assert.strictEqual(engine.renderAsInfix(actual), "2*x");
            engine.release();
        });
        it("-2*x", function () {
            const lines: string[] = [
                `-2*x`
            ];
            const engine = createScriptEngine();
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(* -2 x)");
            assert.strictEqual(engine.renderAsInfix(actual), "-2*x");
            engine.release();
        });
        it("a*a", function () {
            const lines: string[] = [
                `a*a`
            ];
            const engine = createScriptEngine({
                disable: ['factorize']
            });
            const actual = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "(power a 2)");
            assert.strictEqual(engine.renderAsInfix(actual), "a**2");

            engine.release();
        });
    });
});
