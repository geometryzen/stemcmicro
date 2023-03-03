import { assert } from "chai";
import { MATH_ADD, MATH_MUL } from "../src/runtime/ns_math";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("assoc", function () {
    describe("Add", function () {
        it("B", function () {
            const lines: string[] = [
                `a+b+c+d`,
            ];
            const engine = create_script_context({ useCaretForExponentiation: true });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), '(+ a b c d)');
            assert.strictEqual(engine.renderAsInfix(value), 'a+b+c+d');
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `a+b+c+d`,
            ];
            const engine = create_script_context({ useCaretForExponentiation: true });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), '(+ a b c d)');
            assert.strictEqual(engine.renderAsInfix(value), 'a+b+c+d');
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `a+b+c+d`,
            ];
            const engine = create_script_context({
                assocs: [{ sym: MATH_ADD, dir: 'R' }],
                useCaretForExponentiation: true
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), '(+ a b c d)');
            assert.strictEqual(engine.renderAsInfix(value), 'a+b+c+d');
            engine.release();
        });
    });
    describe("Multiply", function () {
        it("B", function () {
            const lines: string[] = [
                `a*b*c*d`,
            ];
            const engine = create_script_context({ useCaretForExponentiation: true });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), '(* a b c d)');
            assert.strictEqual(engine.renderAsInfix(value), 'a*b*c*d');
            engine.release();
        });
        it("C", function () {
            const lines: string[] = [
                `a*b*c*d`,
            ];
            const engine = create_script_context({ useCaretForExponentiation: true });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), '(* a b c d)');
            assert.strictEqual(engine.renderAsInfix(value), 'a*b*c*d');
            engine.release();
        });
        it("D", function () {
            const lines: string[] = [
                `a*b*c*d`,
            ];
            const engine = create_script_context({
                assocs: [{ sym: MATH_MUL, dir: 'R' }],
                useCaretForExponentiation: true
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsSExpr(value), '(* a b c d)');
            assert.strictEqual(engine.renderAsInfix(value), 'a*b*c*d');
            engine.release();
        });
    });
});
