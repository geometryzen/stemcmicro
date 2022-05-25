import { assert } from 'chai';
import { makeList } from '../src/makeList';
import { hash_info } from '../src/hashing/hash_info';
import { MATH_ADD, MATH_INNER, MATH_MUL, MATH_OUTER } from '../src/runtime/ns_math';
import { negOne } from '../src/tree/rat/Rat';
import { Sym } from '../src/tree/sym/Sym';

describe("hash_info", function () {
    it("Sym", function () {
        const foo = new Sym('foo');
        const hashes = hash_info(foo);
        assert.strictEqual(hashes[0], 'Sym');
    });
    it("Sym", function () {
        const a = new Sym('a');
        const b = new Sym('b');
        const lhs = makeList(MATH_INNER, a, b);
        const rhs = makeList(MATH_MUL, negOne, makeList(MATH_OUTER, a, b));
        const expr = makeList(MATH_ADD, lhs, rhs);
        const hashes = hash_info(expr);
        assert.strictEqual(hashes.length, 5);
        assert.strictEqual(hashes[0], '(add (|) (*))');
        assert.strictEqual(hashes[1], '(add (|) U)');
        assert.strictEqual(hashes[2], '(add U (*))');
        assert.strictEqual(hashes[3], '(add U U)');
        assert.strictEqual(hashes[4], '(add)');
    });
});