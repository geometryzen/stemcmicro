import { assert } from 'chai';
import { hash_info } from '../src/hashing/hash_info';
import { items_to_cons } from '../src/makeList';
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER } from '../src/runtime/ns_math';
import { negOne } from '../src/tree/rat/Rat';
import { create_sym } from '../src/tree/sym/Sym';

describe("hash_info", function () {
    it("A", function () {
        const foo = create_sym('foo');
        const hashes = hash_info(foo);
        assert.strictEqual(hashes[0], 'Sym');
    });
    it("B", function () {
        const a = create_sym('a');
        const b = create_sym('b');
        const lhs = items_to_cons(MATH_INNER, a, b);
        const rhs = items_to_cons(MATH_MUL, negOne, items_to_cons(MATH_OUTER, a, b));
        const expr = items_to_cons(MATH_ADD, lhs, rhs);
        const hashes = hash_info(expr);
        assert.strictEqual(hashes.length, 5);
        // The idea here is that the lexical representation of symbols is the key() property of the symbol.
        assert.strictEqual(hashes[0], `(+ (${MATH_INNER.key()}) (*))`);
        assert.strictEqual(hashes[1], `(+ (${MATH_INNER.key()}) U)`);
        assert.strictEqual(hashes[2], '(+ U (*))');
        assert.strictEqual(hashes[3], '(+ U U)');
        assert.strictEqual(hashes[4], '(+)');
    });
});