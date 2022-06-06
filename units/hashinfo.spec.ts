import { assert } from 'chai';
import { hash_info } from '../src/hashing/hash_info';
import { makeList } from '../src/makeList';
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER } from '../src/runtime/ns_math';
import { negOne } from '../src/tree/rat/Rat';
import { Sym } from '../src/tree/sym/Sym';

describe("hash_info", function () {
    it("A", function () {
        const foo = new Sym('foo');
        const hashes = hash_info(foo);
        assert.strictEqual(hashes[0], 'Sym');
    });
    it("B", function () {
        const a = new Sym('a');
        const b = new Sym('b');
        const lhs = makeList(MATH_INNER, a, b);
        const rhs = makeList(MATH_MUL, negOne, makeList(MATH_OUTER, a, b));
        const expr = makeList(MATH_ADD, lhs, rhs);
        const hashes = hash_info(expr);
        assert.strictEqual(hashes.length, 5);
        // The idea here is that the lexical representation of symbols is the key() property of the symbol.
        assert.strictEqual(hashes[0], `(add (${MATH_INNER.key()}) (*))`);
        assert.strictEqual(hashes[1], `(add (${MATH_INNER.key()}) U)`);
        assert.strictEqual(hashes[2], '(add U (*))');
        assert.strictEqual(hashes[3], '(add U U)');
        assert.strictEqual(hashes[4], '(add)');
    });
});