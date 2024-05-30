import assert from "assert";
import { is_err } from "math-expression-atoms";
import { is_atom } from "math-expression-tree";
import { is_localizable } from "../src/diagnostics/diagnostics";
import { create_script_context } from "../src/runtime/script_engine";

describe("calculus", function () {
    describe("undefined", function () {
        it("x/0 is undefined", function () {
            const lines: string[] = [`x/0`];
            const context = create_script_context({});
            const { values, errors } = context.executeScript(lines.join("\n"));
            assert.strictEqual(values.length, 1);
            assert.strictEqual(errors.length, 0);
            // This could be improved upon...
            // assert.strictEqual(context.renderAsSExpr(values[0]), "(* 2 undefined)");
            const value = values[0];
            assert.strictEqual(is_atom(value), true);
            if (is_atom(value)) {
                assert.strictEqual(value.type, "error");
                if (is_err(value)) {
                    const cause = value.cause;
                    if (is_localizable(cause)) {
                        // Consider trying to make the codes non-magic numbers?
                        assert.strictEqual(cause.message.code, 1002);
                    }
                }
            }
            assert.strictEqual(context.renderAsInfix(value), "Division by zero.");
            context.release();
        });
        it("2/0 is undefined", function () {
            const lines: string[] = [`2/0`];
            const context = create_script_context({});
            const { values, errors } = context.executeScript(lines.join("\n"));
            assert.strictEqual(values.length, 1);
            assert.strictEqual(errors.length, 0);
            // This could be improved upon...
            // assert.strictEqual(context.renderAsSExpr(values[0]), "(* 2 undefined)");
            assert.strictEqual(context.renderAsInfix(values[0]), "Division by zero.");
            context.release();
        });
        it("0/0 is undefined", function () {
            const lines: string[] = [`0/0`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsSExpr(values[0]), "Division by zero.");
            assert.strictEqual(context.renderAsInfix(values[0]), "Division by zero.");
            context.release();
        });
        it("2.0/0.0 is undefined", function () {
            const lines: string[] = [`2.0/0.0`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "Division by zero.");
            assert.strictEqual(context.renderAsInfix(values[0]), "Division by zero.");
            context.release();
        });
        it("5/(1+3-4) is undefined", function () {
            const lines: string[] = [`5/(1+3-4)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "Division by zero.");
            assert.strictEqual(context.renderAsInfix(values[0]), "Division by zero.");
            context.release();
        });
        xit("5.0/(1.0+3.0-4.0) is undefined", function () {
            const lines: string[] = [`5.0/(1.0+3.0-4.0)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "Division by zero.");
            assert.strictEqual(context.renderAsInfix(values[0]), "Division by zero.");
            context.release();
        });
        it("x/(1+3-4) is undefined", function () {
            const lines: string[] = [`x/(1+3-4)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "Division by zero.");
            assert.strictEqual(context.renderAsInfix(values[0]), "Division by zero.");
            context.release();
        });
    });
    describe("roots", function () {
        it("sqrt(c)", function () {
            const lines: string[] = [`sqrt(c)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            // This could be improved upon...
            assert.strictEqual(context.renderAsSExpr(values[0]), "(pow c 1/2)");
            assert.strictEqual(context.renderAsInfix(values[0]), "c**(1/2)");
            context.release();
        });
    });
    describe("abs", function () {
        xit("abs(x)", function () {
            const lines: string[] = [`abs(x)`];
            const context = create_script_context({
                assumes: {
                    x: { real: true }
                }
            });
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "(x**2)**(1/2)");
            context.release();
        });
        xit("abs(x) when x > 0", function () {
            const lines: string[] = [`abs(x)`];
            const context = create_script_context({
                assumes: {
                    x: { positive: true }
                }
            });
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "x");
            context.release();
        });
        xit("abs(x) when x < 0", function () {
            const lines: string[] = [`abs(x)`];
            const context = create_script_context({
                assumes: {
                    x: { negative: true }
                }
            });
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "-x");
            context.release();
        });
        xit("abs(x) when x = 0", function () {
            const lines: string[] = [`abs(x)`];
            const context = create_script_context({
                assumes: {
                    x: { zero: true }
                }
            });
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "0");
            context.release();
        });
    });
    describe("infinitesimal", function () {
        it("isreal(x)", function () {
            const lines: string[] = [`isreal(x)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it("isinfinitesimal(x)", function () {
            const lines: string[] = [`isinfinitesimal(x)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "false");
            context.release();
        });
        it("isinfinitesimal(x)", function () {
            const lines: string[] = [`isinfinitesimal(x)`];
            const context = create_script_context({
                assumes: {
                    x: { zero: true }
                }
            });
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it("isinfinitesimal(5)", function () {
            const lines: string[] = [`isinfinitesimal(5)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "false");
            context.release();
        });
        it("isinfinitesimal(0)", function () {
            const lines: string[] = [`isinfinitesimal(0)`];
            const context = create_script_context({
                assumes: {
                    x: { zero: true }
                }
            });
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it(`infinitesimal("dx")`, function () {
            const lines: string[] = [`dx=infinitesimal("dx")`, `dx`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "dx");
            context.release();
        });
        it(`isinfinitesimal(dx)`, function () {
            const lines: string[] = [`dx=infinitesimal("dx")`, `isinfinitesimal(dx)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
        it(`isinfinitesimal(-dx)`, function () {
            const lines: string[] = [`dx=infinitesimal("dx")`, `isinfinitesimal(-dx)`];
            const context = create_script_context({});
            const { values } = context.executeScript(lines.join("\n"));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            context.release();
        });
    });
});
