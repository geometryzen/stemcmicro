import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";

xdescribe("typhon", function () {
    it("137", function () {
        const lines: string[] = [
            `137`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), "137");
        context.release();
    });
    it("137.0", function () {
        const lines: string[] = [
            `137.0`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), "137.0");
        context.release();
    });
    it("12345678901234567890", function () {
        const lines: string[] = [
            `12345678901234567890`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), "12345678901234567890");
        context.release();
    });
    it("x", function () {
        const lines: string[] = [
            `x`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), "x");
        context.release();
    });
    it("hello", function () {
        const lines: string[] = [
            `"hello"`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), `"hello"`);
        context.release();
    });
    it("x=23", function () {
        const lines: string[] = [
            `x=23`,
            `x`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), `23`);
        context.release();
    });
    it("foo()", function () {
        const lines: string[] = [
            `foo()`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(foo)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `foo`);
        context.release();
    });
    it("foo(x)", function () {
        const lines: string[] = [
            `foo(x)`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(foo x)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `foo(x)`);
        context.release();
    });
    it("foo(x,y)", function () {
        const lines: string[] = [
            `foo(x,y)`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(foo x y)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `foo(x,y)`);
        context.release();
    });
    it("a+b", function () {
        const lines: string[] = [
            `a+b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(+ a b)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a+b`);
        context.release();
    });
    it("a+b+c", function () {
        const lines: string[] = [
            `a+b+c`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(+ a b c)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a+b+c`);
        context.release();
    });
    it("a-b", function () {
        const lines: string[] = [
            `a-b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(- a b)`);
        // TODO: We need a transformer to normalize.
        assert.strictEqual(context.renderAsInfix(values[0]), `-(a,b)`);
        context.release();
    });
    it("a*b", function () {
        const lines: string[] = [
            `a*b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(* a b)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a*b`);
        context.release();
    });
    it("a/b", function () {
        const lines: string[] = [
            `a/b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(/ a b)`);
        // TODO
        assert.strictEqual(context.renderAsInfix(values[0]), `/(a,b)`);
        context.release();
    });
    it("a**b", function () {
        const lines: string[] = [
            `a**b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(pow a b)`);
        // TODO
        assert.strictEqual(context.renderAsInfix(values[0]), `a**b`);
        context.release();
    });
    it("a^b", function () {
        const lines: string[] = [
            `a^b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(^ a b)`);
        // TODO
        assert.strictEqual(context.renderAsInfix(values[0]), `a^b`);
        context.release();
    });
    it("a<<b", function () {
        const lines: string[] = [
            `a<<b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(<< a b)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a<<b`);
        context.release();
    });
    it("a>>b", function () {
        const lines: string[] = [
            `a>>b`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(>> a b)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a>>b`);
        context.release();
    });
    it("[a,b,c]", function () {
        const lines: string[] = [
            `[a,b,c]`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `[a b c]`);
        assert.strictEqual(context.renderAsInfix(values[0]), `[a,b,c]`);
        context.release();
    });
    // TODO: Looks like 'typhon-lang' package may not implement component access.
    it("a[5]", function () {
        const lines: string[] = [
            `a[5]`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(component a 5)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a[5]`);
        context.release();
    });
    it("a[6]", function () {
        const lines: string[] = [
            `a[6]`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.STEMCscript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `(component a 6)`);
        assert.strictEqual(context.renderAsInfix(values[0]), `a[6]`);
        context.release();
    });
    it("Geometric Algebra I", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["i","j","k"])`,
            `G30`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `[i j k]`);
        assert.strictEqual(context.renderAsInfix(values[0]), `[i,j,k]`);
        context.release();
    });
    it("Geometric Algebra II", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["i","j","k"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `e1`,
            `e2`,
            `e3`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 3, "values.length");
        assert.strictEqual(context.renderAsSExpr(values[0]), `i`);
        assert.strictEqual(context.renderAsInfix(values[0]), `i`);
        assert.strictEqual(context.renderAsSExpr(values[1]), `j`);
        assert.strictEqual(context.renderAsInfix(values[1]), `j`);
        assert.strictEqual(context.renderAsSExpr(values[2]), `k`);
        assert.strictEqual(context.renderAsInfix(values[2]), `k`);
        context.release();
    });
    it("i*i", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `i*i`
        ];
        const sourceText = lines.join('\n');
        const context = create_script_context({
            syntaxKind: SyntaxKind.PythonScript
        });
        const { values } = context.executeScript(sourceText);
        assert.isArray(values);
        assert.strictEqual(values.length, 1, "values.length");
        assert.strictEqual(context.renderAsInfix(values[0]), `-1`);
        context.release();
    });
});