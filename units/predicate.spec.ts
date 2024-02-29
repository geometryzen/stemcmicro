import assert from 'assert';
import { create_sym } from "math-expression-atoms";
import { Predicates } from "../src/env/ExtensionEnv";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("predicate", function () {
    describe("invariants", function () {
        it("defaults", function () {
            const context = create_script_context({
                assumes: {}
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, true, "real");
            assert.strictEqual(predicates.finite, true, "finite");
            assert.strictEqual(predicates.infinite, false, "infinite");
            assert.strictEqual(predicates.infinitesimal, false, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
        });
        it("zero", function () {
            const context = create_script_context({
                assumes: {
                    'x': { zero: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, true, "real");
            assert.strictEqual(predicates.finite, true, "finite");
            assert.strictEqual(predicates.infinite, false, "infinite");
            assert.strictEqual(predicates.infinitesimal, true, "infinitesimal");
            assert.strictEqual(predicates.nonzero, false, "nonzero");
            assert.strictEqual(predicates.zero, true, "zero");
            assert.strictEqual(predicates.positive, false, "positive");
            assert.strictEqual(predicates.negative, false, "negative");
            assert.strictEqual(predicates.integer, true, "integer");
        });
        it("infinite", function () {
            const context = create_script_context({
                assumes: {
                    'x': { infinite: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, false, "real");
            assert.strictEqual(predicates.finite, false, "finite");
            assert.strictEqual(predicates.infinite, true, "infinite");
            assert.strictEqual(predicates.infinitesimal, false, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
            assert.strictEqual(predicates.positive, true, "positive");
            assert.strictEqual(predicates.negative, false, "negative");
            assert.strictEqual(predicates.integer, false, "integer");
        });
        it("infinite, positive", function () {
            const context = create_script_context({
                assumes: {
                    'x': { infinite: true, positive: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, false, "real");
            assert.strictEqual(predicates.finite, false, "finite");
            assert.strictEqual(predicates.infinite, true, "infinite");
            assert.strictEqual(predicates.infinitesimal, false, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
            assert.strictEqual(predicates.positive, true, "positive");
            assert.strictEqual(predicates.negative, false, "negative");
            assert.strictEqual(predicates.integer, false, "integer");
        });
        it("infinite, negative", function () {
            const context = create_script_context({
                assumes: {
                    'x': { infinite: true, negative: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, false, "real");
            assert.strictEqual(predicates.finite, false, "finite");
            assert.strictEqual(predicates.infinite, true, "infinite");
            assert.strictEqual(predicates.infinitesimal, false, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
            assert.strictEqual(predicates.positive, false, "positive");
            assert.strictEqual(predicates.negative, true, "negative");
            assert.strictEqual(predicates.integer, false, "integer");
        });
        it("infinitesimal", function () {
            const context = create_script_context({
                assumes: {
                    'x': { infinitesimal: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, false, "real");
            assert.strictEqual(predicates.finite, true, "finite");
            assert.strictEqual(predicates.infinite, false, "infinite");
            assert.strictEqual(predicates.infinitesimal, true, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
            assert.strictEqual(predicates.positive, true, "positive");
            assert.strictEqual(predicates.negative, false, "negative");
            assert.strictEqual(predicates.integer, false, "integer");
        });
        it("infinitesimal, positive", function () {
            const context = create_script_context({
                assumes: {
                    'x': { infinitesimal: true, positive: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, false, "real");
            assert.strictEqual(predicates.finite, true, "finite");
            assert.strictEqual(predicates.infinite, false, "infinite");
            assert.strictEqual(predicates.infinitesimal, true, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
            assert.strictEqual(predicates.positive, true, "positive");
            assert.strictEqual(predicates.negative, false, "negative");
            assert.strictEqual(predicates.integer, false, "integer");
        });
        it("infinitesimal, negative", function () {
            const context = create_script_context({
                assumes: {
                    'x': { infinitesimal: true, negative: true }
                }
            });
            const $ = context.$;
            const predicates: Predicates = $.getSymbolPredicates(create_sym('x'));
            assert.strictEqual(predicates.complex, true, "complex");
            assert.strictEqual(predicates.hypercomplex, true, "hypercomplex");
            assert.strictEqual(predicates.hyperreal, true, "hyperreal");
            assert.strictEqual(predicates.real, false, "real");
            assert.strictEqual(predicates.finite, true, "finite");
            assert.strictEqual(predicates.infinite, false, "infinite");
            assert.strictEqual(predicates.infinitesimal, true, "infinitesimal");
            assert.strictEqual(predicates.nonzero, true, "nonzero");
            assert.strictEqual(predicates.zero, false, "zero");
            assert.strictEqual(predicates.positive, false, "positive");
            assert.strictEqual(predicates.negative, true, "negative");
            assert.strictEqual(predicates.integer, false, "integer");
        });
    });
    describe("relational", function () {
        xit("x==0 when x is nonzero", function () {
            const lines: string[] = [
                `x==0`
            ];
            const context = create_script_context({
                assumes: {
                    'x': { nonzero: true }
                }
            });
            const value = assert_one_value_execute(lines.join('\n'), context);
            assert.strictEqual(context.renderAsSExpr(value), "false");
            assert.strictEqual(context.renderAsInfix(value), 'false');
        });
        xit("x==0 when x is zero", function () {
            const lines: string[] = [
                `x==0`
            ];
            const context = create_script_context({
                assumes: {
                    'x': { zero: true }
                }
            });
            const value = assert_one_value_execute(lines.join('\n'), context);
            assert.strictEqual(context.renderAsSExpr(value), "true");
            assert.strictEqual(context.renderAsInfix(value), 'true');
        });
        xit("x>0", function () {
            const lines: string[] = [
                `x>0`
            ];
            const engine = create_script_context({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), "true");
            assert.strictEqual(engine.renderAsInfix(value), 'true');
        });
        xit("x<0", function () {
            const lines: string[] = [
                `x<0`
            ];
            const engine = create_script_context({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            // TODO: Why the different capitalization?
            assert.strictEqual(engine.renderAsSExpr(value), "false");
            assert.strictEqual(engine.renderAsInfix(value), 'false');
        });
        xit("x * y < 0", function () {
            const lines: string[] = [
                `x * y < 0`
            ];
            const engine = create_script_context({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            // TODO: Why the different capitalization?
            assert.strictEqual(engine.renderAsSExpr(value), "false");
            assert.strictEqual(engine.renderAsInfix(value), 'false');
        });
        xit("x * y > 0", function () {
            const lines: string[] = [
                `x * y > 0`
            ];
            const engine = create_script_context({
                dependencies: []
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            // TODO: Why the different capitalization?
            assert.strictEqual(engine.renderAsSExpr(value), "true");
            assert.strictEqual(engine.renderAsInfix(value), 'true');
        });
    });
    describe("", function () {
        xit("eps", function () {
            const lines: string[] = [
                `isinfinitesimal(eps)`,
                `isfinite(eps)`
            ];
            const context = create_script_context({
                assumes: {
                    'eps': { positive: true, infinitesimal: true }
                }
            });
            const { values } = context.executeScript(lines.join('\n'));
            assert.strictEqual(context.renderAsInfix(values[0]), "true");
            assert.strictEqual(context.renderAsInfix(values[1]), "true");
        });
    });
});
