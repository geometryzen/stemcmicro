
import assert from 'assert';
import { create_rat, create_sym, is_sym, Sym } from "math-expression-atoms";
import { Cons, is_cons, is_nil, nil, U } from "math-expression-tree";
import { zip } from "../src/functional/zip";
import { items_to_cons } from "../src/makeList";
import { ProgrammingError } from "../src/programming/ProgrammingError";

export class IllegalArgumentError extends Error {
    #context: Cons;
    #needle: Sym;
    #actual: U;
    /**
     * 
     * @param context 
     * @param needle 
     * @param expecting TODO: We need to be able to define types...
     * @param actual 
     */
    constructor(context: Cons, needle: Sym, expecting: U, actual: U) {
        super();
        this.name = "IllegalArgumentError";
        this.#context = context;
        this.#needle = needle;
        this.#actual = actual;
        // Non-localized message
        this.message = `${context}: ${needle} must be a ${expecting} but got ${actual}.`;
    }
    get context(): Cons {
        return this.#context;
    }
    get needle(): Sym {
        return this.#needle;
    }
    get actual(): U {
        return this.#actual;
    }
}

/**
 * Move to math-expression-atoms?
 */
function assert_cons(expr: U, context?: Cons, needle?: Sym): Cons {
    if (is_cons(expr)) {
        return expr;
    }
    else {
        if (context && is_cons(context) && needle && is_sym(needle)) {
            const expecting = items_to_cons(create_sym("iscons?"), expr);
            throw new IllegalArgumentError(context, needle, expecting, expr);
        }
        else {
            throw new ProgrammingError();
        }
    }
}

describe("(zip lhs rhs)", function () {
    it("(zip nil nil) => nil", function () {
        const retval = zip(nil, nil);
        assert.strictEqual(is_nil(retval), true);
    });
    it("(zip (x) (3)) => (x 3)", function () {
        const lhs = items_to_cons(create_sym("x"));
        const rhs = items_to_cons(create_rat(3, 1));
        const zipped = assert_cons(zip(lhs, rhs));
        assert.strictEqual(is_cons(zipped), true);
        assert.strictEqual(zipped.length, 2);
        assert.strictEqual(zipped.item(0).equals(lhs.item(0)), true);
        assert.strictEqual(zipped.item(1).equals(rhs.item(0)), true);
    });
    it("(zip (x y) (3 5)) => (x 3 y 5)", function () {
        const lhs = items_to_cons(create_sym("x"), create_sym("y"));
        const rhs = items_to_cons(create_rat(3, 1), create_rat(5, 1));
        const zipped = assert_cons(zip(lhs, rhs));
        assert.strictEqual(is_cons(zipped), true);
        assert.strictEqual(zipped.length, 4);
        assert.strictEqual(zipped.item(0).equals(lhs.item(0)), true);
        assert.strictEqual(zipped.item(1).equals(rhs.item(0)), true);
        assert.strictEqual(zipped.item(2).equals(lhs.item(1)), true);
        assert.strictEqual(zipped.item(3).equals(rhs.item(1)), true);
    });
    it("(zip (x y z) (3 5 7)) => (x 3 y 5 z 7)", function () {
        const lhs = items_to_cons(create_sym("x"), create_sym("y"), create_sym("z"));
        const rhs = items_to_cons(create_rat(3, 1), create_rat(5, 1), create_rat(7, 1));
        const zipped = assert_cons(zip(lhs, rhs));
        assert.strictEqual(is_cons(zipped), true);
        assert.strictEqual(zipped.length, 6);
        assert.strictEqual(zipped.item(0).equals(lhs.item(0)), true);
        assert.strictEqual(zipped.item(1).equals(rhs.item(0)), true);
        assert.strictEqual(zipped.item(2).equals(lhs.item(1)), true);
        assert.strictEqual(zipped.item(3).equals(rhs.item(1)), true);
        assert.strictEqual(zipped.item(4).equals(lhs.item(2)), true);
        assert.strictEqual(zipped.item(5).equals(rhs.item(2)), true);
    });
    it("(zip (x y) (3)) => (x 3 y nil)", function () {
        const lhs = items_to_cons(create_sym("x"), create_sym("y"));
        const rhs = items_to_cons(create_rat(3, 1));
        const zipped = assert_cons(zip(lhs, rhs));
        assert.strictEqual(is_cons(zipped), true);
        assert.strictEqual(zipped.length, 4);
        assert.strictEqual(zipped.item(0).equals(lhs.item(0)), true);
        assert.strictEqual(zipped.item(1).equals(rhs.item(0)), true);
        assert.strictEqual(zipped.item(2).equals(lhs.item(1)), true);
        assert.strictEqual(zipped.item(3).equals(nil), true);
    });
    it("(zip (x) (3 5)) => (x 3 nil 5)", function () {
        const lhs = items_to_cons(create_sym("x"));
        const rhs = items_to_cons(create_rat(3, 1), create_rat(5, 1));
        const zipped = assert_cons(zip(lhs, rhs));
        assert.strictEqual(is_cons(zipped), true);
        assert.strictEqual(zipped.length, 4);
        assert.strictEqual(zipped.item(0).equals(lhs.item(0)), true);
        assert.strictEqual(zipped.item(1).equals(rhs.item(0)), true);
        assert.strictEqual(zipped.item(2).equals(nil), true);
        assert.strictEqual(zipped.item(3).equals(rhs.item(1)), true);
    });
});
