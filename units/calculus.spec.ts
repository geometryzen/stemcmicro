
import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

xdescribe("calculus", function () {
    describe("undefined", function () {
        it("2/0 is undefined", function () {
            const lines: string[] = [
                `2/0`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(* 2 undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "2*undefined");
            context.release();
        });
        it("0/0 is undefined", function () {
            const lines: string[] = [
                `0/0`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "0");
            assert.strictEqual(context.renderAsInfix(values[0]), "0");
            context.release();
        });
        it("2.0/0.0 is undefined", function () {
            const lines: string[] = [
                `2.0/0.0`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(* 2.0 undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "2.0*undefined");
            context.release();
        });
        it("x/0 is undefined", function () {
            const lines: string[] = [
                `x/0`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(* x undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "x*undefined");
            context.release();
        });
        it("5/(1+3-4) is undefined", function () {
            const lines: string[] = [
                `5/(1+3-4)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(* 5 undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "5*undefined");
            context.release();
        });
        it("5.0/(1.0+3.0-4.0) is undefined", function () {
            const lines: string[] = [
                `5.0/(1.0+3.0-4.0)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(* 5.0 undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "5.0*undefined");
            context.release();
        });
        it("x/(1+3-4) is undefined", function () {
            const lines: string[] = [
                `x/(1+3-4)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(* x undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "x*undefined");
            context.release();
        });
    });
    describe("roots", function () {
        it("sqrt(c)", function () {
            const lines: string[] = [
                `sqrt(c)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(pow c 1/2)");
            assert.strictEqual(context.renderAsInfix(values[0]), "c**(1/2)");
            context.release();
        });
    });
    describe("abs", function () {
        xit("abs(x)", function () {
            const lines: string[] = [
                `abs(x)`,
            ];
            const context = create_script_context({
                assumes: {
                    'x': { real: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "(x**2)**(1/2)");
            context.release();
        });
        it("abs(x) when x > 0", function () {
            const lines: string[] = [
                `abs(x)`,
            ];
            const context = create_script_context({
                assumes: {
                    'x': { positive: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "x");
            context.release();
        });
        it("abs(x) when x < 0", function () {
            const lines: string[] = [
                `abs(x)`,
            ];
            const context = create_script_context({
                assumes: {
                    'x': { negative: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "-x");
            context.release();
        });
        it("abs(x) when x = 0", function () {
            const lines: string[] = [
                `abs(x)`,
            ];
            const context = create_script_context({
                assumes: {
                    'x': { zero: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "0");
            context.release();
        });
    });
    describe("infinitesimal", function () {
        it("isreal(x)", function () {
            const lines: string[] = [
                `isreal(x)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it("isinfinitesimal(x)", function () {
            const lines: string[] = [
                `isinfinitesimal(x)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "false");
            context.release();
        });
        it("isinfinitesimal(x)", function () {
            const lines: string[] = [
                `isinfinitesimal(x)`,
            ];
            const context = create_script_context({
                assumes: {
                    'x': { zero: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it("isinfinitesimal(5)", function () {
            const lines: string[] = [
                `isinfinitesimal(5)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "false");
            context.release();
        });
        it("isinfinitesimal(0)", function () {
            const lines: string[] = [
                `isinfinitesimal(0)`,
            ];
            const context = create_script_context({
                assumes: {
                    'x': { zero: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it(`infinitesimal("dx")`, function () {
            const lines: string[] = [
                `dx=infinitesimal("dx")`,
                `dx`
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "dx");
            context.release();
        });
        it(`isinfinitesimal(dx)`, function () {
            const lines: string[] = [
                `dx=infinitesimal("dx")`,
                `isinfinitesimal(dx)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it(`isinfinitesimal(-dx)`, function () {
            const lines: string[] = [
                `dx=infinitesimal("dx")`,
                `isinfinitesimal(-dx)`,
            ];
            const context = create_script_context({
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
    });
});
