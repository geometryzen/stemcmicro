import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { create_sym } from "../src/tree/sym/Sym";
import { Tensor } from "../src/tree/tensor/Tensor";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("tensor-sandbox", function () {
    it("det", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(actual), "a*d-b*c");
        engine.release();
    });
});

describe("tensor", function () {
    it("sanity-check", function () {
        // const engine = create_script_context();
        const a = create_sym('a');
        const b = create_sym('b');
        const c = create_sym('c');
        const d = create_sym('d');
        const e = create_sym('e');
        const f = create_sym('f');
        // const ab = new Tensor([2], [a, b]);
        // const cd = new Tensor([2], [c, d]);
        // const ef = new Tensor([2], [e, f]);
        const M = new Tensor([1, 2, 3, 4, 5, 6], [a, b, c, d, e, f]);
        assert.strictEqual(M.ndim, 6);
        assert.strictEqual(M.dim(0), 1);
        assert.strictEqual(M.dim(1), 2);
        // TODO: Do this some other way to avoid breaking encapsulation of ExtensionEnv.
        /*
        assert.isTrue(get_component(ab, items_to_cons(wrap_as_int(1)), env).equals(a));
        assert.isTrue(get_component(ab, items_to_cons(wrap_as_int(2)), env).equals(b));
        assert.isTrue(get_component(cd, items_to_cons(wrap_as_int(1)), env).equals(c));
        assert.isTrue(get_component(cd, items_to_cons(wrap_as_int(2)), env).equals(d));
        assert.isTrue(get_component(ef, items_to_cons(wrap_as_int(1)), env).equals(e));
        assert.isTrue(get_component(ef, items_to_cons(wrap_as_int(2)), env).equals(f));
        assert.isTrue(get_component(M, items_to_cons(), env).equals(M));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(1)), env).equals(ab));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(2)), env).equals(cd));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(3)), env).equals(ef));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(1), wrap_as_int(1)), env).equals(a));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(1), wrap_as_int(2)), env).equals(b));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(2), wrap_as_int(1)), env).equals(c));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(2), wrap_as_int(2)), env).equals(d));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(3), wrap_as_int(1)), env).equals(e));
        assert.isTrue(get_component(M, items_to_cons(wrap_as_int(3), wrap_as_int(2)), env).equals(f));
        */
    });
    it("printing", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `A`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "[[a,b],[c,d]]");
        assert.strictEqual(engine.renderAsInfix(actual), "[[a,b],[c,d]]");

        engine.release();
    });
    describe("index", function () {
        it("A[]", function () {
            // TODO: The scanner does not allow
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsSExpr(actual), "[[a,b],[c,d]]");
            assert.strictEqual(engine.renderAsInfix(actual), "[[a,b],[c,d]]");
            engine.release();
        });
        it("A[1]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[1]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsInfix(actual), "[a,b]");
            engine.release();
        });
        it("A[2]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[2]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsInfix(actual), "[c,d]");
            engine.release();
        });
        it("A[1,1]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[1,1]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsInfix(actual), "a");
            engine.release();
        });
        it("A[1,2]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[1,2]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsInfix(actual), "b");
            engine.release();
        });
        it("A[2,1]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[2,1]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsInfix(actual), "c");
            engine.release();
        });
        it("A[2,2]", function () {
            const lines: string[] = [
                `A=[[a,b],[c,d]]`,
                `A[2,2]`
            ];
            const sourceText = lines.join('\n');
            const engine = create_script_context();
            const actual = assert_one_value_execute(sourceText, engine);
            assert.strictEqual(engine.renderAsInfix(actual), "d");
            engine.release();
        });
    });
    describe("algebra", function () {
        it("[[a,b],[c,d]]+[[p,q],[r,s]]", function () {
            const lines: string[] = [
                `[[a,b],[c,d]]+[[p,q],[r,s]]`
            ];
            const engine = create_script_context({
                dependencies: [],
                useDefinitions: false,
                useCaretForExponentiation: false
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "[[a+p,b+q],[c+r,d+s]]");
            engine.release();
        });
        it("[[p,q],[r,s]]+[[a,b],[c,d]]", function () {
            const lines: string[] = [
                `[[p,q],[r,s]]+[[a,b],[c,d]]`
            ];
            const engine = create_script_context({
                dependencies: [],
                useDefinitions: false,
                useCaretForExponentiation: false
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "[[a+p,b+q],[c+r,d+s]]");
            engine.release();
        });
        it("s*[[a,b],[c,d]]", function () {
            const lines: string[] = [
                `s*[[a,b],[c,d]]`
            ];
            const engine = create_script_context({
                dependencies: [],
                useDefinitions: false,
                useCaretForExponentiation: false
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "[[a*s,b*s],[c*s,d*s]]");
            engine.release();
        });
        it("[[a,b],[c,d]]*s", function () {
            const lines: string[] = [
                `[[a,b],[c,d]]*s`
            ];
            const engine = create_script_context({
                dependencies: [],
                useDefinitions: false,
                useCaretForExponentiation: false
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "[[a*s,b*s],[c*s,d*s]]");
            engine.release();
        });
        it("[[a,b],[c,d]]+[[p,q],[r,s]]", function () {
            const lines: string[] = [
                `[[a,b],[c,d]]+[[p,q],[r,s]]`
            ];
            const engine = create_script_context({
                dependencies: [],
                useDefinitions: false,
                useCaretForExponentiation: false
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "[[a+p,b+q],[c+r,d+s]]");
            engine.release();
        });
        it("[[a,b],[c,d]]*[[p,q],[r,s]]", function () {
            const lines: string[] = [
                `[[a,b],[c,d]]*[[p,q],[r,s]]`
            ];
            const engine = create_script_context({
                dependencies: [],
                useDefinitions: false,
                useCaretForExponentiation: false
            });
            const { values } = engine.executeScript(lines.join('\n'));
            assert.strictEqual(engine.renderAsInfix(values[0]), "[[a*p+b*r,a*q+b*s],[c*p+d*r,c*q+d*s]]");
            engine.release();
        });
    });
    it("abs", function () {
        const lines: string[] = [
            `abs([a,b])`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(actual), "(a**2+b**2)**(1/2)");
        engine.release();
    });
    it("adj", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `adj(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[d,-b],[-c,a]]");
        engine.release();
    });
    it("det", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(actual), "a*d-b*c");
        engine.release();
    });
    it("inv", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[d/(a*d-b*c),-b/(a*d-b*c)],[-c/(a*d-b*c),a/(a*d-b*c)]]");
        engine.release();
    });
    it("inv-adj/det", function () {
        const lines: string[] = [
            `A=[[a,b],[c,d]]`,
            `inv(A)-adj(A)/det(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "[[0,0],[0,0]]");
        assert.strictEqual(engine.renderAsInfix(actual), "[[0,0],[0,0]]");
        engine.release();
    });
    it("-[0,0]", function () {
        const lines: string[] = [
            `-[0,0]`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true,
            useCaretForExponentiation: false
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "[0,0]");
        assert.strictEqual(engine.renderAsInfix(values[0]), "[0,0]");
        engine.release();
    });
    it("inv", function () {
        const lines: string[] = [
            `A=[[1,-0.1],[0.2,-1]]`,
            `inv(A)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context();
        const actual = assert_one_value_execute(sourceText, engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[1.020408...,-0.102041...],[0.204082...,-1.020408...]]");
        engine.release();
    });
});
