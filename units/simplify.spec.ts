import { assert } from "chai";
import { is_nil } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("simplify", function () {
    it("A", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `pi=tau(1)/2`,
            `simplify(exp(-3/4*i*pi))`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "-1/2*2^(1/2)*(1+i)");

        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `simplify(cos(x)^2+sin(x)^2)`
        ];
        const engine = create_script_context({ useCaretForExponentiation: true });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "1");
        assert.strictEqual(engine.renderAsInfix(actual), "1");

        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `simplify(cos(x)**2+sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "1");
            }
        }
        engine.release();
    });
    it("D", function () {
        const lines: string[] = [
            `simplify(S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S");
            }
        }
        engine.release();
    });
    it("E", function () {
        const lines: string[] = [
            `simplify(-M+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "-M+S");
            }
        }
        engine.release();
    });
    it("F", function () {
        const lines: string[] = [
            `simplify(-M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-M*cos(x)");
            }
        }
        engine.release();
    });
    it("G", function () {
        const lines: string[] = [
            `simplify(-M*sin(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-M*sin(x)");
            }
        }
        engine.release();
    });
    // Adding this multiplication breaks things
    it("H", function () {
        const lines: string[] = [
            `simplify(-9.81*M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-9.81*M*cos(x)");
            }
        }
        engine.release();
    });
    // Removing M makes it work.
    it("I", function () {
        const lines: string[] = [
            `simplify(-9.81*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-9.81*cos(x)");
            }
        }
        engine.release();
    });
    // Removing cos(x) makes it work.
    it("J", function () {
        const lines: string[] = [
            `simplify(-9.81*M+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "-9.81*M+S");
            }
        }
        engine.release();
    });
    // 9.81 changed to K works.
    it("K", function () {
        const lines: string[] = [
            `simplify(-K*M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-K*M*cos(x)");
            }
        }
        engine.release();
    });
    // Eigenmath does not perform the simplification.
    xit("L using Eigenmath", function () {
        const lines: string[] = [
            `simplify(-9.81*M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Eigenmath });
        const { trees, errors } = engine.parse(sourceText, { useCaretForExponentiation: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "-9.81 M cos(x) + S cos(x)**2 + S sin(x)**2");
            }
        }
        engine.release();
    });
    // Changing cos(x) to L avoids the problem.
    it("M", function () {
        const lines: string[] = [
            `simplify(-9.81*M*L+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, { useCaretForExponentiation: false });
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-9.81*L*M");
            }
        }
        engine.release();
    });
    it("N", function () {
        const lines: string[] = [
            `simplify(M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S+M*cos(x)");
            }
        }
        engine.release();
    });
    it("O", function () {
        const lines: string[] = [
            `simplify(3*M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S+3*M*cos(x)");
            }
        }
        engine.release();
    });
    // Just changing 3 to 3.0 causes a problem.
    it("P", function () {
        const lines: string[] = [
            `simplify(3.0*M*cos(x)+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S+3.0*M*cos(x)");
            }
        }
        engine.release();
    });
    it("Q", function () {
        const lines: string[] = [
            `kg=uom("kilogram")`,
            `simplify(-9.81*M*cos(x)*kg+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-9.81*M*cos(x)*kg");
            }
        }
        engine.release();
    });
    xit("R", function () {
        const lines: string[] = [
            `kg=uom("kilogram")`,
            `G20=algebra([1,1],["e1","e2"])`,
            `e1=G20[1]`,
            `simplify(-9.81*M*cos(x)*e1*kg+S*cos(x)**2+S*sin(x)**2)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ syntaxKind: SyntaxKind.Algebrite });
        const { trees, errors } = engine.parse(sourceText, {});
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "S-9.81*M*cos(x)*kg");
            }
        }
        engine.release();
    });
});
