import assert from "assert";
import { create_sym } from "math-expression-atoms";
import { nil } from "math-expression-tree";
import { UndeclaredVars } from "../src/api/api";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("assumptions", function () {
    it("defaults", function () {
        const lines: string[] = [`sqrt(a)`];
        const context = create_script_context({
            allowUndeclaredVars: UndeclaredVars.Nil
        });

        const aValue = context.getBinding(create_sym("a"), nil);
        assert.strictEqual(aValue.toString(), `a`);

        const aProps = context.getSymbolProps(create_sym("a"));
        assert.strictEqual(Object.keys(aProps).length, 28);
        assert.strictEqual(aProps.algebraic, true); // 1
        assert.strictEqual(aProps.antihermitian, false); // 2
        assert.strictEqual(aProps.commutative, true); // 3
        assert.strictEqual(aProps.complex, true); // 4
        assert.strictEqual(aProps.extended_negative, false); // 5
        assert.strictEqual(aProps.extended_nonnegative, true); // 6
        assert.strictEqual(aProps.extended_nonpositive, false); // 7
        assert.strictEqual(aProps.extended_nonzero, true); // 8
        assert.strictEqual(aProps.extended_positive, true); // 9
        assert.strictEqual(aProps.finite, true); // 10
        assert.strictEqual(aProps.hermitian, true); // 11
        assert.strictEqual(aProps.hypercomplex, true); // 12
        assert.strictEqual(aProps.hyperreal, true); // 13
        assert.strictEqual(aProps.imaginary, false); // 14
        assert.strictEqual(aProps.infinite, false); // 15
        assert.strictEqual(aProps.infinitesimal, false); // 16
        assert.strictEqual(aProps.integer, false); // 17
        assert.strictEqual(aProps.irrational, false); // 18
        assert.strictEqual(aProps.negative, false); // 19
        assert.strictEqual(aProps.noninteger, false); // 20
        assert.strictEqual(aProps.nonnegative, true); // 21
        assert.strictEqual(aProps.nonpositive, false); // 22
        assert.strictEqual(aProps.nonzero, true); // 23
        assert.strictEqual(aProps.positive, true); // 24
        assert.strictEqual(aProps.rational, true); // 25
        assert.strictEqual(aProps.real, true); // 26
        assert.strictEqual(aProps.transcendental, false); // 27
        assert.strictEqual(aProps.zero, false); // 28

        const actual = assert_one_value_execute(lines.join("\n"), context);
        assert.strictEqual(context.renderAsSExpr(actual), "(pow a 1/2)");
        assert.strictEqual(context.renderAsInfix(actual), "a**(1/2)");
        context.release();
    });
});
