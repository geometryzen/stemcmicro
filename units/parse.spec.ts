
import { assert } from "chai";
import { Cons, is_cons, U } from 'math-expression-tree';
import { create_engine, ExprEngine } from "../src/api/index";

function assert_cons(x: U): Cons {
    if (is_cons(x)) {
        return x;
    }
    else {
        throw new Error();
    }
}

describe("pos", function () {
    it("Sym = Rat", function () {
        const lines: string[] = [
            `xyz = 123`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module), "module(xyz=123)");
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), "(module (= xyz 123))");
        const assignExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(assignExpr), "xyz=123");
        const lhs = assignExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "xyz");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 3);
        const opr = assignExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "=");
        assert.strictEqual(opr.pos, 4);
        assert.strictEqual(opr.end, 5);
        const rhs = assignExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), "123");
        assert.strictEqual(rhs.pos, 6);
        assert.strictEqual(rhs.end, 9);

        assert.strictEqual(assignExpr.pos, 0);
        assert.strictEqual(assignExpr.end, 9);

        engine.release();
    });
    it("Sym = Flt", function () {
        const lines: string[] = [
            `xyz = 1.3`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module), "module(xyz=1.3)");
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), "(module (= xyz 1.3))");
        const assignExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(assignExpr), "xyz=1.3");
        const lhs = assignExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "xyz");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 3);
        const opr = assignExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "=");
        assert.strictEqual(opr.pos, 4);
        assert.strictEqual(opr.end, 5);
        const rhs = assignExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), "1.3");
        assert.strictEqual(rhs.pos, 6);
        assert.strictEqual(rhs.end, 9);

        assert.strictEqual(assignExpr.pos, 0);
        assert.strictEqual(assignExpr.end, 9);

        engine.release();
    });
    it("Sym = Str", function () {
        const lines: string[] = [
            `xyz = "1"`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module), `module(xyz="1")`);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (= xyz "1"))`);
        const assignExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(assignExpr), `xyz="1"`);
        const lhs = assignExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "xyz");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 3);
        const opr = assignExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "=");
        assert.strictEqual(opr.pos, 4);
        assert.strictEqual(opr.end, 5);
        const rhs = assignExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `"1"`);
        assert.strictEqual(rhs.pos, 6);
        assert.strictEqual(rhs.end, 9);

        assert.strictEqual(assignExpr.pos, 0);
        assert.strictEqual(assignExpr.end, 9);

        engine.release();
    });
    it("Sym==Rat", function () {
        const lines: string[] = [
            `xyz==123`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        // assert.strictEqual(engine.renderAsString(module), `module(xyz==123)`);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (== xyz 123))`);
        const eqExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(eqExpr, { format: 'SExpr' }), `(== xyz 123)`);
        const lhs = eqExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "xyz");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 3);
        const opr = eqExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "==");
        assert.strictEqual(opr.pos, 3);
        assert.strictEqual(opr.end, 5);
        const rhs = eqExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `123`);
        assert.strictEqual(rhs.pos, 5);
        assert.strictEqual(rhs.end, 8);

        assert.strictEqual(eqExpr.pos, 0);
        assert.strictEqual(eqExpr.end, 8);

        engine.release();
    });
    it("Sym+Sym", function () {
        const lines: string[] = [
            `a+b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (+ a b))`);
        const addExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(addExpr, { format: 'SExpr' }), `(+ a b)`);
        const lhs = addExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        const opr = addExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "+");
        assert.strictEqual(opr.pos, void 0);
        assert.strictEqual(opr.end, void 0);
        const rhs = addExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `b`);
        assert.strictEqual(rhs.pos, 2);
        assert.strictEqual(rhs.end, 3);

        assert.strictEqual(addExpr.pos, 0);
        assert.strictEqual(addExpr.end, 3);

        engine.release();
    });
    it("Sym+Sym+Sym", function () {
        const lines: string[] = [
            `a+b+c`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (+ a b c))`);
        const addExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(addExpr, { format: 'SExpr' }), `(+ a b c)`);
        const a = addExpr.item(1);
        assert.strictEqual(engine.renderAsString(a), "a");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 1);
        const b = addExpr.item(2);
        assert.strictEqual(engine.renderAsString(b), `b`);
        assert.strictEqual(b.pos, 2);
        assert.strictEqual(b.end, 3);
        const c = addExpr.item(3);
        assert.strictEqual(engine.renderAsString(c), `c`);
        assert.strictEqual(c.pos, 4);
        assert.strictEqual(c.end, 5);

        const opr = addExpr.item(0);
        assert.strictEqual(engine.renderAsString(opr), "+");
        assert.strictEqual(opr.pos, void 0);
        assert.strictEqual(opr.end, void 0);

        assert.strictEqual(addExpr.pos, 0);
        assert.strictEqual(addExpr.end, 5);

        engine.release();
    });
    it("Sym-Sym", function () {
        const lines: string[] = [
            `a-b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (+ a (* b -1)))`);
        const addExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(addExpr, { format: 'SExpr' }), `(+ a (* b -1))`);
        
        const lhs = addExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        
        const opr = addExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "+");
        assert.strictEqual(opr.pos, void 0);
        assert.strictEqual(opr.end, void 0);

        const rhs = addExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs, { format: 'SExpr' }), `(* b -1)`);
        assert.strictEqual(rhs.pos, 2);
        assert.strictEqual(rhs.end, 3);

        assert.strictEqual(addExpr.pos, 0);
        assert.strictEqual(addExpr.end, 3);

        engine.release();
    });
    it("Sym-Sym-Sym", function () {
        const lines: string[] = [
            `a-b-c`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (+ a (* b -1) (* c -1)))`);
        const addExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(addExpr, { format: 'SExpr' }), `(+ a (* b -1) (* c -1))`);
        const a = addExpr.item(1);
        assert.strictEqual(engine.renderAsString(a), "a");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 1);
        const b = addExpr.item(2);
        assert.strictEqual(engine.renderAsString(b, { format: 'SExpr' }), `(* b -1)`);
        assert.strictEqual(b.pos, 2);
        assert.strictEqual(b.end, 3);
        const c = addExpr.item(3);
        assert.strictEqual(engine.renderAsString(c, { format: 'SExpr' }), `(* c -1)`);
        assert.strictEqual(c.pos, 4);
        assert.strictEqual(c.end, 5);

        const opr = addExpr.item(0);
        assert.strictEqual(engine.renderAsString(opr), "+");
        assert.strictEqual(opr.pos, void 0);
        assert.strictEqual(opr.end, void 0);

        assert.strictEqual(addExpr.pos, 0);
        assert.strictEqual(addExpr.end, 5);

        engine.release();
    });
    it("Sym*Sym", function () {
        const lines: string[] = [
            `a*b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (* a b))`);
        const multiplyExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(multiplyExpr, { format: 'SExpr' }), `(* a b)`);
        const lhs = multiplyExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        const opr = multiplyExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "*");
        // assert.strictEqual(opr.pos, void 0);
        // assert.strictEqual(opr.end, void 0);
        const rhs = multiplyExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `b`);
        assert.strictEqual(rhs.pos, 2);
        assert.strictEqual(rhs.end, 3);

        assert.strictEqual(multiplyExpr.pos, 0);
        assert.strictEqual(multiplyExpr.end, 3);

        engine.release();
    });
    it("Sym*Sym*Sym", function () {
        const lines: string[] = [
            `a*b*c`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (* a b c))`);
        const multiplyExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(multiplyExpr, { format: 'SExpr' }), `(* a b c)`);
        const a = multiplyExpr.item(1);
        assert.strictEqual(engine.renderAsString(a), "a");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 1);
        const b = multiplyExpr.item(2);
        assert.strictEqual(engine.renderAsString(b), `b`);
        assert.strictEqual(b.pos, 2);
        assert.strictEqual(b.end, 3);
        const c = multiplyExpr.item(3);
        assert.strictEqual(engine.renderAsString(c), `c`);
        assert.strictEqual(c.pos, 4);
        assert.strictEqual(c.end, 5);

        // The operator position is ambiguous.
        const opr = multiplyExpr.item(0);
        assert.strictEqual(engine.renderAsString(opr), "*");
        // assert.strictEqual(opr.pos, void 0);
        // assert.strictEqual(opr.end, void 0);

        assert.strictEqual(multiplyExpr.pos, 0);
        assert.strictEqual(multiplyExpr.end, 5);

        engine.release();
    });
    it("Sym^Sym", function () {
        const lines: string[] = [
            `a^b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (^ a b))`);
        const wedgeExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(wedgeExpr, { format: 'SExpr' }), `(^ a b)`);
        const lhs = wedgeExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        const opr = wedgeExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "outer");
        assert.strictEqual(opr.pos, 1);
        assert.strictEqual(opr.end, 2);
        const rhs = wedgeExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `b`);
        assert.strictEqual(rhs.pos, 2);
        assert.strictEqual(rhs.end, 3);

        assert.strictEqual(wedgeExpr.pos, 0);
        assert.strictEqual(wedgeExpr.end, 3);

        engine.release();
    });
    it("Sym^Sym^Sym", function () {
        const lines: string[] = [
            `a^b^c`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (^ (^ a b) c))`);
        const wedgeExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(wedgeExpr, { format: 'SExpr' }), `(^ (^ a b) c)`);
        const a = wedgeExpr.item(1);
        assert.strictEqual(engine.renderAsString(a), "a^b");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 3);
        const c = wedgeExpr.item(2);
        assert.strictEqual(engine.renderAsString(c), `c`);
        assert.strictEqual(c.pos, 4);
        assert.strictEqual(c.end, 5);

        // The operator position is ambiguous.
        const opr = wedgeExpr.item(0);
        assert.strictEqual(engine.renderAsString(opr), "outer");
        assert.strictEqual(opr.pos, 3);
        assert.strictEqual(opr.end, 4);

        assert.strictEqual(wedgeExpr.pos, 0);
        assert.strictEqual(wedgeExpr.end, 5);

        engine.release();
    });
    it("Sym << Sym", function () {
        const lines: string[] = [
            `a << b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (<< a b))`);
        const lcoExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(lcoExpr, { format: 'SExpr' }), `(<< a b)`);
        const lhs = lcoExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        const opr = lcoExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "<<");
        assert.strictEqual(opr.pos, 2);
        assert.strictEqual(opr.end, 4);
        const rhs = lcoExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `b`);
        assert.strictEqual(rhs.pos, 5);
        assert.strictEqual(rhs.end, 6);

        assert.strictEqual(lcoExpr.pos, 0);
        assert.strictEqual(lcoExpr.end, 6);

        engine.release();
    });
    it("Sym >> Sym", function () {
        const lines: string[] = [
            `a >> b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (>> a b))`);
        const rcoExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(rcoExpr, { format: 'SExpr' }), `(>> a b)`);
        const lhs = rcoExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        const opr = rcoExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), ">>");
        assert.strictEqual(opr.pos, 2);
        assert.strictEqual(opr.end, 4);
        const rhs = rcoExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `b`);
        assert.strictEqual(rhs.pos, 5);
        assert.strictEqual(rhs.end, 6);

        assert.strictEqual(rcoExpr.pos, 0);
        assert.strictEqual(rcoExpr.end, 6);

        engine.release();
    });
    it("Sym ** Sym", function () {
        const lines: string[] = [
            `a ** b`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (pow a b))`);
        const powExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(powExpr, { format: 'SExpr' }), `(pow a b)`);
        const lhs = powExpr.lhs;
        assert.strictEqual(engine.renderAsString(lhs), "a");
        assert.strictEqual(lhs.pos, 0);
        assert.strictEqual(lhs.end, 1);
        const opr = powExpr.opr;
        assert.strictEqual(engine.renderAsString(opr), "**");
        assert.strictEqual(opr.pos, 2);
        assert.strictEqual(opr.end, 4);
        const rhs = powExpr.rhs;
        assert.strictEqual(engine.renderAsString(rhs), `b`);
        assert.strictEqual(rhs.pos, 5);
        assert.strictEqual(rhs.end, 6);

        assert.strictEqual(powExpr.pos, 0);
        assert.strictEqual(powExpr.end, 6);

        engine.release();
    });
    it("+Sym", function () {
        const lines: string[] = [
            `+a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module a)`);
        const a = module.item(1);
        assert.strictEqual(engine.renderAsString(a, { format: 'SExpr' }), "a");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 2);

        engine.release();
    });
    it("-Sym", function () {
        const lines: string[] = [
            `-a`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (* a -1))`);
        const powExpr = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(powExpr, { format: 'SExpr' }), "(* a -1)");
        assert.strictEqual(powExpr.pos, 0);
        assert.strictEqual(powExpr.end, 2);

        const base = powExpr.base;
        assert.strictEqual(engine.renderAsString(base, { format: 'SExpr' }), "a");
        assert.strictEqual(base.pos, 1);
        assert.strictEqual(base.end, 2);

        const expo = powExpr.expo;
        assert.strictEqual(engine.renderAsString(expo, { format: 'SExpr' }), "-1");
        assert.strictEqual(expo.pos, void 0);
        assert.strictEqual(expo.end, void 0);

        engine.release();
    });
    it("Tensor", function () {
        const lines: string[] = [
            `[ [ a , b ],[ c , d ] ]`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module [[a b] [c d]])`);
        const tensor = module.item(1);
        assert.strictEqual(engine.renderAsString(tensor, { format: 'SExpr' }), "[[a b] [c d]]");
        assert.strictEqual(tensor.pos, 0);
        assert.strictEqual(tensor.end, 23);

        engine.release();
    });
    it("Function Call", function () {
        const lines: string[] = [
            `foo(x)`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (foo x))`);
        const x = module.item(1);
        assert.strictEqual(engine.renderAsString(x, { format: 'SExpr' }), "(foo x)");
        assert.strictEqual(x.pos, 0);
        assert.strictEqual(x.end, 6);

        engine.release();
    });
    it("Indexing", function () {
        const lines: string[] = [
            `A[1]`,
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module (component A 1))`);
        
        const x = assert_cons(module.item(1));
        assert.strictEqual(engine.renderAsString(x, { format: 'SExpr' }), "(component A 1)");
        assert.strictEqual(x.pos, 0);
        assert.strictEqual(x.end, 4);

        const A = x.item(1);
        assert.strictEqual(engine.renderAsString(A, { format: 'SExpr' }), "A");
        assert.strictEqual(A.pos, 0);
        assert.strictEqual(A.end, 1);

        const idx = x.item(2);
        assert.strictEqual(engine.renderAsString(idx, { format: 'SExpr' }), "1");
        assert.strictEqual(idx.pos, 2);
        assert.strictEqual(idx.end, 3);

        engine.release();
    });
    it("multiline", function () {
        const lines: string[] = [
            `aaa`,
            `[b]`,
            `"c"`,
            `123`,
            `1.5`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module), `module(aaa,[b],"c",123,1.5)`);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module aaa [b] "c" 123 1.5)`);

        const a = module.item(1);
        assert.strictEqual(engine.renderAsString(a), "aaa");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 3);

        const b = module.item(2);
        assert.strictEqual(engine.renderAsString(b), "[b]");
        assert.strictEqual(b.pos, 4);
        assert.strictEqual(b.end, 7);

        const str = module.item(3);
        assert.strictEqual(engine.renderAsString(str), `"c"`);
        assert.strictEqual(str.pos, 8);
        assert.strictEqual(str.end, 11);

        const rat = module.item(4);
        assert.strictEqual(engine.renderAsString(rat), "123");
        assert.strictEqual(rat.pos, 12);
        assert.strictEqual(rat.end, 15);

        const flt = module.item(5);
        assert.strictEqual(engine.renderAsString(flt), "1.5");
        assert.strictEqual(flt.pos, 16);
        assert.strictEqual(flt.end, 19);

        engine.release();
    });
});