
import { assert } from "chai";
import { create_script_context } from "../index";
import { is_sym } from "../src/operators/sym/is_sym";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("symbol", function () {
    it('symbol("description")', function () {
        const lines: string[] = [
            `x=symbol("description")`,
            `x`
        ];
        const context = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "description");
        assert.strictEqual(is_sym(value), true);
        if (is_sym(value)) {
            const predicates = context.$.getSymbolPredicates(value);
            assert.strictEqual(predicates.infinite, false);
        }
        context.release();
    });
    it('symbol("description",["infinite",true])', function () {
        const lines: string[] = [
            `x=symbol("description",["infinite",true])`,
            `x`
        ];
        const context = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "description");
        assert.strictEqual(is_sym(value), true);
        if (is_sym(value)) {
            const predicates = context.$.getSymbolPredicates(value);
            assert.strictEqual(predicates.infinite, true);
        }
        context.release();
    });
    it('symbol("description",["infinite",false])', function () {
        const lines: string[] = [
            `x=symbol("description",["infinite",false])`,
            `x`
        ];
        const context = create_script_context({
            useDefinitions: false
        });
        const value = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(value), "description");
        assert.strictEqual(is_sym(value), true);
        if (is_sym(value)) {
            const predicates = context.$.getSymbolPredicates(value);
            assert.strictEqual(predicates.infinite, false);
        }
        context.release();
    });
});