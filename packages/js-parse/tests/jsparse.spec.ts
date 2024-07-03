import assert from "assert";
import { js_parse } from "../src/js_parse";

describe("jsparse", function () {
    it("should be able to parse a user symbol", function () {
        const lines: string[] = [`x`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "x");
        // engine.release();
    });
    it("should be able to parse a Rat", function () {
        const lines: string[] = [`12345`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "12345");
        // engine.release();
    });
    it("should be able to parse a Flt", function () {
        const lines: string[] = [`12345.0`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "12345.0");
        // engine.release();
    });
    it("should be able to parse a Str", function () {
        const lines: string[] = [`"Hello"`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), '"Hello"');
        // engine.release();
    });
    it("should be able to parse 'true'", function () {
        const lines: string[] = [`true`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "true");
        // engine.release();
    });
    it("should be able to parse 'false'", function () {
        const lines: string[] = [`false`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "false");
        // engine.release();
    });
    it("should be able to parse an additive (+) expression", function () {
        const lines: string[] = [`a+b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a+b");
        // engine.release();
    });
    it("should be able to parse an additive (-) expression", function () {
        const lines: string[] = [`a-b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a-b");
        // engine.release();
    });
    it("should be able to parse an multiplicative (*) expression", function () {
        const lines: string[] = [`a*b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a*b");
        // engine.release();
    });
    it("should be able to parse an multiplicative (/) expression", function () {
        const lines: string[] = [`a/b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a/b");
        // engine.release();
    });
    it("should be able to parse an outer product '^' expression", function () {
        const lines: string[] = [`a^b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a^b");
        // engine.release();
    });
    it("should be able to parse an interior product '|' expression", function () {
        const lines: string[] = [`a|b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a|b");
        // engine.release();
    });
    it("should be able to parse a left contraction(<<) expression", function () {
        const lines: string[] = [`a<<b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a<<b");
        // engine.release();
    });
    it("should be able to parse a right contraction(>>) expression", function () {
        const lines: string[] = [`a>>b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a>>b");
        // engine.release();
    });
    it("should be able to parse an exponentiation (**) expression", function () {
        const lines: string[] = [`a**b`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "a**b");
        // engine.release();
    });
    it("should be able to parse an assignment expression", function () {
        const lines: string[] = [`x = 23`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "x=23");
        // engine.release();
    });
    it("should be able to parse a function call expression", function () {
        const lines: string[] = [`foo(1,2,3)`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "foo(1,2,3)");
        // engine.release();
    });
    it("should be able to parse an array expression", function () {
        const lines: string[] = [`[1,2,3]`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "[1,2,3]");
        // engine.release();
    });
    it("should be able to parse a member expression", function () {
        const lines: string[] = [`x[1]`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "x[1]");
        // assert.strictEqual(engine.renderAsString(trees[0], sexprConfig), "(component x 1)");
        // engine.release();
    });
    it("should be able to parse a member expression", function () {
        const lines: string[] = [`x[1,2,3]`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "x[1,2,3]");
        // assert.strictEqual(engine.renderAsString(trees[0], sexprConfig), "(component x 1 2 3)");
        // engine.release();
    });
    it("should be able to parse a null Literal", function () {
        const lines: string[] = [`null`];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);
        // assert.strictEqual(engine.renderAsString(trees[0], infixConfig), "()");
        // assert.strictEqual(engine.renderAsString(trees[0], sexprConfig), "()");
        // engine.release();
    });
    it("STEMCmicro", function () {
        const lines: string[] = [
            `G20 = algebra([1, 1, 1], ["ex", "ey", "ez"])`,
            `ex = G20[1]`,
            `ey = G20[2]`,
            `i = sqrt(-1)`,
            `nroots(x ** 4 + 1)`,
            `mega * joule`,
            `pi`,
            `ex * (2 * ex + 3 * ey)`,
            `2.7 * kilo * volt / (milli * ampere)`,
            `cos(x) ** 2 + sin(x) ** 2`,
            `A = hilbert(3)`,
            `A`,
            `eigenval(A)`,
            `cross(ex, ey)`
        ];
        const sourceText = lines.join("\n");
        const { trees, errors } = js_parse(sourceText);
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 14);
        /*
        assert.strictEqual(engine.renderAsString(trees[0], infixConfig), 'G20=algebra([1,1,1],["ex","ey","ez"])');
        assert.strictEqual(engine.renderAsString(trees[1], infixConfig), "ex=G20[1]");
        assert.strictEqual(engine.renderAsString(trees[2], infixConfig), "ey=G20[2]");
        assert.strictEqual(engine.renderAsString(trees[3], infixConfig), "i=sqrt(-1)");
        assert.strictEqual(engine.renderAsString(trees[4], infixConfig), "nroots(x**4+1)");
        assert.strictEqual(engine.renderAsString(trees[5], infixConfig), "mega*joule");
        assert.strictEqual(engine.renderAsString(trees[6], infixConfig), "pi");
        assert.strictEqual(engine.renderAsString(trees[7], infixConfig), "ex*(2*ex+3*ey)");
        assert.strictEqual(engine.renderAsString(trees[8], infixConfig), "((2.7*kilo)*volt)/(milli*ampere)");
        assert.strictEqual(engine.renderAsString(trees[9], infixConfig), "cos(x)**2+sin(x)**2");
        assert.strictEqual(engine.renderAsString(trees[10], infixConfig), "A=hilbert(3)");
        assert.strictEqual(engine.renderAsString(trees[11], infixConfig), "A");
        assert.strictEqual(engine.renderAsString(trees[12], infixConfig), "eigenval(A)");
        assert.strictEqual(engine.renderAsString(trees[13], infixConfig), "cross(ex,ey)");
        engine.release();
        */
    });
});
