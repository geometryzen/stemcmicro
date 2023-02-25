import { assert } from "chai";
import { createScriptEngine } from "../index";

describe("example", function () {
    it("a divided by b", function () {
        const lines: string[] = [
            `a/b`
        ];
        const eng = createScriptEngine();
        const { values } = eng.executeScript(lines.join('\n'));
        assert.strictEqual(eng.renderAsInfix(values[0]), "a/b");
        assert.strictEqual(eng.renderAsSExpr(values[0]), "(* a (power b -1))");
        assert.strictEqual(eng.renderAsLaTeX(values[0]), "\\frac{a}{b}");
        eng.release();
    });
    it("x*(4-x)", function () {
        const lines: string[] = [
            `x*(4-x)`
        ];
        const eng = createScriptEngine({
            disable: ['factorize']
        });
        const { values } = eng.executeScript(lines.join('\n'));
        // TODO: It would be nice to factor the common x out the lhs or rhs.
        assert.strictEqual(eng.renderAsInfix(values[0]), "4*x-x**2");
        assert.strictEqual(eng.renderAsSExpr(values[0]), "(+ (* 4 x) (* -1 (power x 2)))");
        assert.strictEqual(eng.renderAsLaTeX(values[0]), "4x-x^2");
        eng.release();
    });
});
