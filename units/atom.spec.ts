
import { assert } from "chai";
import { Atom } from "math-expression-atoms";
import { ExprContext, LambdaExpr } from "math-expression-context";
import { Cons, is_nil, U } from "math-expression-tree";
import { create_engine, ExprEngine } from "../src/api/index";

class TestAtom extends Atom<'TestAtom'> {
    constructor() {
        super('TestAtom');
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        else {
            return false;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const create_atom: LambdaExpr = (argList: Cons, _$: ExprContext): U => {
    return new TestAtom();
};


describe("atom", function () {
    it("Native handling of custom atom", function () {
        const lines: string[] = [
            `A=atom()`,
            `abs(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        engine.defineFunction("atom", create_atom);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "abs([object Object])");
            }
        }
        engine.release();
    });
    it("Eigenmath handling of custom atom", function () {
        const lines: string[] = [
            `A=atom()`,
            `abs(A)`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: false });
        engine.defineFunction("atom", create_atom);
        const { trees, errors } = engine.parse(sourceText);
        assert.strictEqual(errors.length, 0);
        for (const tree of trees) {
            const value = engine.evaluate(tree);
            if (!is_nil(value)) {
                assert.strictEqual(engine.renderAsString(value, { format: 'Infix' }), "abs([object Object])");
            }
        }
        engine.release();
    });
});