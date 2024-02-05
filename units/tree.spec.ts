import { assert } from 'chai';
import { Atom } from 'math-expression-atoms';
import { car, cdr, Cons, is_cons, is_singleton, items_to_cons, nil, U } from 'math-expression-tree';

/**
 * A simple atom for testing purposes.
 */
class Int extends Atom {
    constructor(public readonly value: number, pos?: number, end?: number) {
        super('Int', pos, end);
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (other instanceof Int) {
            return this.equalsInt(other);
        }
        else {
            return false;
        }
    }
    equalsInt(other: Int): boolean {
        return this.value === other.value;
    }
    toString(): string {
        return `${this.value}`;
    }
}

const two = new Int(2);
const six = new Int(6);

describe('tree', function () {
    describe('NIL', function () {
        it('should be defined', function () {
            assert.isDefined(nil);
        });
        it('toString()', function () {
            assert.strictEqual(nil.toString(), '()');
        });
        it('car should be NIL', function () {
            assert.strictEqual(nil.car, nil);
        });
        it('cdr should be NIL', function () {
            assert.strictEqual(nil.cdr, nil);
        });
        it('argList should be NIL', function () {
            assert.strictEqual(nil.argList, nil);
        });
        it('iterator should produce an empty list', function () {
            const elements = [...nil];
            assert.strictEqual(elements.length, 0);
        });
        it('head should be NIL', function () {
            assert.strictEqual(nil.head, nil);
        });
        it('tail should raise an error', function () {
            try {
                nil.tail();
                assert.fail();
            }
            catch (e) {
                if (e instanceof Error) {
                    assert.strictEqual(e.message, 'tail property is not allowed for the empty list.');
                }
                else {
                    assert.fail();
                }
            }
        });
        it('map should return the empty list', function () {
            assert.strictEqual(nil.map(function (x) {
                return x;
            }), nil);
        });
    });
    describe('is_nil', function () {
        it('(NIL) should be true', function () {
            assert.isTrue(nil.isnil);
        });
    });
    describe('is_cons', function () {
        it('(NIL) should be false', function () {
            assert.isFalse(is_cons(nil));
        });
        it('(make_list(2,6)) should be true', function () {
            assert.isTrue(is_cons(items_to_cons(two, six)));
        });
    });
    describe('make_list', function () {
        it('(2,3)', function () {
            const x = items_to_cons(two, six);
            assert.strictEqual(x.car, two);
            const cdr = assert_cons(x.cdr);
            assert.strictEqual(cdr.car, six);
            assert.strictEqual(x.toString(), '(2 (6 ()))');
            const elements = [...x];
            assert.strictEqual(elements.length, 2);
            assert.strictEqual(elements[0], two);
            assert.strictEqual(elements[1], six);
            assert.isFalse(is_singleton(x));
        });
        it('(2)', function () {
            const x = items_to_cons(two);
            assert.strictEqual(x.car, two);
            assert.strictEqual(x.cdr, nil);
            assert.strictEqual(x.toString(), '(2 ())');
            const elements = [...x];
            assert.strictEqual(elements.length, 1);
            assert.strictEqual(elements[0], two);
            assert.isTrue(is_singleton(x));
        });
        it('()', function () {
            const x = items_to_cons();
            assert.strictEqual(x.cdr, nil);
            assert.strictEqual(x.cdr, nil);
            assert.strictEqual(x.toString(), '()');
            const elements = [...x];
            assert.strictEqual(elements.length, 0);
            assert.isFalse(is_singleton(x));
            assert.strictEqual(x, nil);
        });
    });
    describe('tail', function () {
        it('(2,3)', function () {
            const x = items_to_cons(two, six);
            const t = x.tail();
            assert.strictEqual(t.length, 1);
            assert.strictEqual(t[0], six);
        });
        it('(2)', function () {
            const x = items_to_cons(two);
            const t = x.tail();
            assert.strictEqual(t.length, 0);
        });
        it('()', function () {
            const x = items_to_cons();
            try {
                x.tail();
                assert.fail();
            }
            catch (e) {
                if (e instanceof Error) {
                    assert.strictEqual(e.message, 'tail property is not allowed for the empty list.');
                }
                else {
                    assert.fail();
                }
            }
        });
    });
    describe('car', function () {
        it('(2,3)', function () {
            const x = items_to_cons(two, six);
            assert.strictEqual(x.car, car(x));
        });
        it('(2)', function () {
            const x = items_to_cons(two);
            assert.strictEqual(x.car, car(x));
        });
        it('()', function () {
            const x = items_to_cons();
            assert.strictEqual(x.car, car(x));
        });
    });
    describe('cdr', function () {
        it('(2,3)', function () {
            const x = items_to_cons(two, six);
            assert.strictEqual(x.cdr, cdr(x));
        });
        it('(2)', function () {
            const x = items_to_cons(two);
            assert.strictEqual(x.cdr, cdr(x));
        });
        it('()', function () {
            const x = items_to_cons();
            assert.strictEqual(x.cdr, cdr(x));
        });
    });
    describe('length', function () {
        it('(2,3)', function () {
            const x = items_to_cons(two, six);
            assert.strictEqual(x.length, 2);
        });
        it('(2)', function () {
            const x = items_to_cons(two);
            assert.strictEqual(x.length, 1);
        });
        it('()', function () {
            const x = items_to_cons();
            assert.strictEqual(x.length, 0);
        });
    });
    describe('item', function () {
        it('(2,3)', function () {
            const x = items_to_cons(two, six);
            assert.strictEqual(x.item(0), two);
            assert.strictEqual(x.item(1), six);
            assert.strictEqual(x.item(2).isnil, true);
        });
        it('(2)', function () {
            const x = items_to_cons(two);
            assert.strictEqual(x.length, 1);
        });
        it('()', function () {
            const x = items_to_cons();
            assert.strictEqual(x.length, 0);
        });
    });
});

function assert_cons(x: U): Cons {
    if (is_cons(x)) {
        return x;
    }
    else {
        assert.fail('x is not a Cons');
    }
}