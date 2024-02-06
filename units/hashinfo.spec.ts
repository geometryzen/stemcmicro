import { assert } from 'chai';
import { create_sym, negOne } from 'math-expression-atoms';
import { Native, native_sym } from 'math-expression-native';
import { items_to_cons } from 'math-expression-tree';
import { hash_info } from '../src/hashing/hash_info';

describe("hash_info", function () {
    it("atom", function () {
        const foo = create_sym('foo');
        const hashes = hash_info(foo);
        assert.strictEqual(hashes.length, 1);
        assert.strictEqual(hashes[0], 'Sym');
    });
    it("(foo x)", function () {
        const expr = items_to_cons(create_sym('foo'), create_sym('x'));
        const hashes = hash_info(expr);
        assert.strictEqual(hashes.length, 3);
        assert.strictEqual(hashes[0], '(foo Sym)');
        assert.strictEqual(hashes[1], '(foo U)');
        assert.strictEqual(hashes[2], '(foo)');
    });
    it("(+ (inner a b) (* -1 (outer a b)))", function () {
        const a = create_sym('a');
        const b = create_sym('b');
        const lhs = items_to_cons(native_sym(Native.inner), a, b);
        const rhs = items_to_cons(native_sym(Native.multiply), negOne, items_to_cons(native_sym(Native.outer), a, b));
        const expr = items_to_cons(native_sym(Native.add), lhs, rhs);
        const hashes = hash_info(expr);
        assert.strictEqual(hashes.length, 5);
        assert.strictEqual(hashes[0], `(+ (inner) (*))`);
        assert.strictEqual(hashes[1], `(+ (inner) U)`);
        assert.strictEqual(hashes[2], '(+ U (*))');
        assert.strictEqual(hashes[3], '(+ U U)');
        assert.strictEqual(hashes[4], '(+)');
    });
});