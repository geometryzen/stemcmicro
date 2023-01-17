import { assert } from "chai";
import { createScriptEngine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("ordering", function () {
    describe("Positive", function () {
        it("a*d(b,c)", function () {
            const lines: string[] = [
                `a*d(b,c)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "a*d(b,c)");
            engine.release();
        });
        it("a*d(c,b)", function () {
            const lines: string[] = [
                `a*d(c,b)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "a*d(c,b)");
            engine.release();
        });
        it("b*d(a,c)", function () {
            const lines: string[] = [
                `b*d(a,c)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "b*d(a,c)");
            engine.release();
        });
        it("b*d(c,a)", function () {
            const lines: string[] = [
                `b*d(c,a)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "b*d(c,a)");
            engine.release();
        });
        it("c*d(a,b)", function () {
            const lines: string[] = [
                `c*d(a,b)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "c*d(a,b)");
            engine.release();
        });
        it("c*d(b,a)", function () {
            const lines: string[] = [
                `c*d(b,a)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "c*d(b,a)");
            engine.release();
        });
        it("d(a,b)*c", function () {
            const lines: string[] = [
                `d(a,b)*c`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "c*d(a,b)");
            engine.release();
        });
        it("d(a,c)*b", function () {
            const lines: string[] = [
                `d(a,c)*b`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "b*d(a,c)");
            engine.release();
        });
        it("d(b,a)*c", function () {
            const lines: string[] = [
                `d(b,a)*c`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "c*d(b,a)");
            engine.release();
        });
        it("d(b,c)*a", function () {
            const lines: string[] = [
                `d(b,c)*a`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "a*d(b,c)");
            engine.release();
        });
        it("d(c,a)*b", function () {
            const lines: string[] = [
                `d(c,a)*b`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "b*d(c,a)");
            engine.release();
        });
        it("d(c,b)*a", function () {
            const lines: string[] = [
                `d(c,b)*a`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "a*d(c,b)");
            engine.release();
        });
    });
    describe("Negative", function () {
        it("-a*d(b,c)", function () {
            const lines: string[] = [
                `-a*d(b,c)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-a*d(b,c)");
            engine.release();
        });
        it("-a*d(c,b)", function () {
            const lines: string[] = [
                `-a*d(c,b)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-a*d(c,b)");
            engine.release();
        });
        it("-b*d(a,c)", function () {
            const lines: string[] = [
                `-b*d(a,c)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-b*d(a,c)");
            engine.release();
        });
        it("-b*d(c,a)", function () {
            const lines: string[] = [
                `-b*d(c,a)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-b*d(c,a)");
            engine.release();
        });
        it("-c*d(a,b)", function () {
            const lines: string[] = [
                `-c*d(a,b)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-c*d(a,b)");
            engine.release();
        });
        it("-c*d(b,a)", function () {
            const lines: string[] = [
                `-c*d(b,a)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-c*d(b,a)");
            engine.release();
        });
        it("-d(a,b)*c", function () {
            const lines: string[] = [
                `-d(a,b)*c`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* -1 c (derivative a b))");
            assert.strictEqual(engine.renderAsInfix(value), "-c*d(a,b)");
            engine.release();
        });
        it("-d(a,c)*b", function () {
            const lines: string[] = [
                `-d(a,c)*b`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-b*d(a,c)");
            engine.release();
        });
        it("-d(b,a)*c", function () {
            const lines: string[] = [
                `-d(b,a)*c`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-c*d(b,a)");
            engine.release();
        });
        it("-d(b,c)*a", function () {
            const lines: string[] = [
                `-d(b,c)*a`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-a*d(b,c)");
            engine.release();
        });
        it("-d(c,a)*b", function () {
            const lines: string[] = [
                `-d(c,a)*b`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "-b*d(c,a)");
            engine.release();
        });
        it("-d(c,b)*a", function () {
            const lines: string[] = [
                `-d(c,b)*a`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "(* -1 a (derivative c b))");
            assert.strictEqual(engine.renderAsInfix(value), "-a*d(c,b)");
            engine.release();
        });
    });
    describe("Sum", function () {
        it("Sum", function () {
            const lines: string[] = [
                `a*d(b,c)+a*d(b,c)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "2*a*d(b,c)");
            engine.release();
        });
        it("Sum", function () {
            const lines: string[] = [
                `p*d(a,b)+q*d(a,b)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "(p+q)*d(a,b)");
            engine.release();
        });
        it("Sum", function () {
            const lines: string[] = [
                `q*d(a,b)+p*d(a,b)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "(p+q)*d(a,b)");
            engine.release();
        });
        it("Sum", function () {
            const lines: string[] = [
                `p*d(a,q)+p*d(b,q)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "p*(d(a,q)+d(b,q))");
            engine.release();
        });
        it("Sum", function () {
            const lines: string[] = [
                `d(b,q)+d(a,q)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "d(a,q)+d(b,q)");
            engine.release();
        });
        it("Sum", function () {
            const lines: string[] = [
                `p*d(b,q)+p*d(a,q)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "p*(d(a,q)+d(b,q))");
            engine.release();
        });
        it("Sum", function () {
            const lines: string[] = [
                `a*d(b,p)+a*d(b,q)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "a*(d(b,p)+d(b,q))");
            engine.release();
        });
    });
    describe("Difference", function () {
        it("Difference", function () {
            const lines: string[] = [
                `a*d(b,c)-a*d(b,c)`
            ];
            const engine = createScriptEngine({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "0");
            engine.release();
        });
    });
});
