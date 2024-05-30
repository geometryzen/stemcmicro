import assert from "assert";
import { is_tensor } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { create_engine } from "../src/api/api";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";
//  x^4 - 10*x^3 + 21*x^2 + 40*x - 100 => [-2,2,5]
describe("roots", function () {
    it("roots(x,x)", function () {
        const lines: string[] = [`roots(x,x)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2^x-y,y)", function () {
        const lines: string[] = [`roots(2^x-y,y)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[2^x]");
        engine.release();
    });
    it("roots(x^2)", function () {
        const lines: string[] = [`roots(x^2)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(x^3)", function () {
        const lines: string[] = [`roots(x^3)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2*x)", function () {
        const lines: string[] = [`roots(2*x)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2*x^2)", function () {
        const lines: string[] = [`roots(2*x^2)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(2*x^3)", function () {
        const lines: string[] = [`roots(2*x^3)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[0]");
        engine.release();
    });
    it("roots(i*x^2-13*i*x+36*i)", function () {
        const lines: string[] = [`roots(i*x^2-13*i*x+36*i)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[4,9]");
        engine.release();
    });
    it("roots(6+11*x+6*x^2+x^3)", function () {
        const lines: string[] = [`roots(6+11*x+6*x^2+x^3)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-3,-2,-1]");
        engine.release();
    });
    it("roots(x^4 - 10*x^3 + 21*x^2 + 40*x - 100)", function () {
        const lines: string[] = [`roots(x^4 - 10*x^3 + 21*x^2 + 40*x - 100)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-2,2,5,5]");
        engine.release();
    });
    it("roots(x-a,x)", function () {
        const lines: string[] = [`roots(x-a,x)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[a]");
        engine.release();
    });
    it("roots(a*x^2+b*x+c)", function () {
        const lines: string[] = [`roots(a*x^2+b*x+c)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-b/(2*a)-1/2*(b^2/(a^2)-4*c/a)^(1/2),-b/(2*a)+1/2*(b^2/(a^2)-4*c/a)^(1/2)]");
        engine.release();
    });
    it("roots(a*x**2+b*x+c)", function () {
        const lines: string[] = [`roots(a*x**2+b*x+c)`];
        const engine = create_script_context({ useCaretForExponentiation: false });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-b/(2*a)-1/2*(b**2/(a**2)-4*c/a)**(1/2),-b/(2*a)+1/2*(b**2/(a**2)-4*c/a)**(1/2)]");
        engine.release();
    });
    it("roots(3+7*x+5*x^2+x^3)", function () {
        const lines: string[] = [`roots(3+7*x+5*x^2+x^3)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-3,-1,-1]");
        engine.release();
    });
    it("roots(x^3+x^2+x+1)", function () {
        const lines: string[] = [`roots(x^3+x^2+x+1)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-1,-i,i]");
        engine.release();
    });
    it("roots(x^2-1)", function () {
        const lines: string[] = [`roots(x^2-1)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-1,1]");
        engine.release();
    });
    xit("roots(x^2==1)", function () {
        const lines: string[] = [`roots(x^2==1)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[-1,1]");
        engine.release();
    });
    it("roots(3*x-12)", function () {
        const lines: string[] = [`roots(3*x-12)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[4]");
        engine.release();
    });
    xit("roots(3*x==12)", function () {
        const lines: string[] = [`roots(3*x==12)`];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join("\n"), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[4]");
        engine.release();
    });
    it("roots(x,x)", function () {
        const lines: string[] = [`roots(x,x)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "[0]");
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("roots x-a", function () {
        const lines: string[] = [`roots(x-a,x)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "[a]");
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("roots (x-a)*(x-b)", function () {
        const lines: string[] = [`roots((x-a)*(x-b),x)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "[a,b]");
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("roots (x-a)*(x-b)*(x-c)", function () {
        const lines: string[] = [`roots((x-a)*(x-b)*(x-c),x)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "[a,b,c]");
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("roots (x-a)*(x-b)*(x-c)*(x-d)", function () {
        const lines: string[] = [`roots((x-a)*(x-b)*(x-c)*(x-d),x)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        // assert.strictEqual(values.length, 1);
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Ascii' }), '2');
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'Human' }), '2');
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "[a,b,c,d]");
        // assert.strictEqual(engine.renderAsString(values[0], { format: 'SExpr' }), '2');
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
    it("roots of cubic", function () {
        const lines: string[] = [`roots(27+27*x+9*x**2+x**3,x)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(trees.length, 1);

        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(engine.renderAsString(values[0], { format: "Infix" }), "[-3,-3,-3]");
        assert.strictEqual(is_tensor(values[0]), true);
        engine.release();
    });
});
