import assert from 'assert';
import { QQ } from 'math-expression-atoms';

describe("QQ", function () {
    describe("constructor", function () {
        it("numer matches construction argument", function () {
            const x = QQ.valueOf(3, 5);
            assert.strictEqual(x.numer, 3);
        });
        it("denom matches construction argument", function () {
            const x = QQ.valueOf(3, 5);
            assert.strictEqual(x.denom, 5);
        });
        it("Construction", function () {
            const x = QQ.valueOf(1, 1);
            assert.strictEqual(x.numer, 1);
            assert.strictEqual(x.denom, 1);
        });
        it("Construction on zero", function () {
            const x = QQ.valueOf(0, 1);
            assert.strictEqual(x.numer, 0);
            assert.strictEqual(x.denom, 1);
        });
        it("GCD", function () {
            const x = QQ.valueOf(2, 2);
            assert.strictEqual(x.numer, 1);
            assert.strictEqual(x.denom, 1);
        });
        it("Canonical (-1,3) => (-1,3)", function () {
            const x = QQ.valueOf(-1, 3);
            assert.strictEqual(x.numer, -1);
            assert.strictEqual(x.denom, 3);
        });
        it("Canonical (1,-3) => (-1,3)", function () {
            const x = QQ.valueOf(1, -3);
            assert.strictEqual(x.numer, -1);
            assert.strictEqual(x.denom, 3);
        });
        it("add QQ", function () {
            const x = QQ.valueOf(1, 3);
            const y = QQ.valueOf(2, 1);
            const sum = x.add(y);
            assert.strictEqual(sum.numer, 7);
            assert.strictEqual(sum.denom, 3);
            assert.strictEqual(x.numer, 1);
            assert.strictEqual(x.denom, 3);
            assert.strictEqual(y.numer, 2);
            assert.strictEqual(y.denom, 1);
        });
        it("sub QQ", function () {
            const x = QQ.valueOf(1, 3);
            const y = QQ.valueOf(2, 1);
            const sum = x.sub(y);
            assert.strictEqual(sum.numer, -5);
            assert.strictEqual(sum.denom, 3);
            assert.strictEqual(x.numer, 1);
            assert.strictEqual(x.denom, 3);
            assert.strictEqual(y.numer, 2);
            assert.strictEqual(y.denom, 1);
        });
        it("mul", function () {
            const x = QQ.valueOf(1, 3);
            const y = QQ.valueOf(2, 1);
            const sum = x.mul(y);
            assert.strictEqual(sum.numer, 2);
            assert.strictEqual(sum.denom, 3);
            assert.strictEqual(x.numer, 1);
            assert.strictEqual(x.denom, 3);
            assert.strictEqual(y.numer, 2);
            assert.strictEqual(y.denom, 1);
        });
        it("div", function () {
            const x = QQ.valueOf(0, 1);
            const y = QQ.valueOf(2, 1);
            const q = x.div(y);
            assert.strictEqual(q.numer, 0);
            assert.strictEqual(q.denom, 1);
            assert.strictEqual(x.numer, 0);
            assert.strictEqual(x.denom, 1);
            assert.strictEqual(y.numer, 2);
            assert.strictEqual(y.denom, 1);
        });
        it("neg() should change the sign of the numerator", function () {
            const x = QQ.valueOf(1, 3);
            const n = x.neg();
            assert.strictEqual(x.numer, +1);
            assert.strictEqual(n.numer, -1);
        });
        it("neg() should leave the denominator unchanged", function () {
            const x = QQ.valueOf(1, 3);
            const n = x.neg();
            assert.strictEqual(x.denom, +3);
            assert.strictEqual(n.denom, +3);
        });
        it("toString", function () {
            const x = QQ.valueOf(1, 2);
            assert.strictEqual("" + x, "1/2");
        });
        describe("valueOf", function () {
            it("should return an equivalent number", function () {
                for (let n = -10; n < 10; n++) {
                    for (let d = -10; d < 10; d++) {
                        if (d !== 0) {
                            const x = QQ.valueOf(n, d);
                            assert.strictEqual(x.numer * d, x.denom * n);
                            if (n === 0) {
                                assert.strictEqual(x.numer, QQ.valueOf(0, 1).numer);
                                assert.strictEqual(x.denom, QQ.valueOf(0, 1).denom);
                            }
                            else if (n === +d) {
                                assert.strictEqual(x.numer, QQ.valueOf(+1, 1).numer);
                                assert.strictEqual(x.denom, QQ.valueOf(+1, 1).denom);
                            }
                            else if (n === -d) {
                                assert.strictEqual(x.numer, QQ.valueOf(-1, 1).numer);
                                assert.strictEqual(x.denom, QQ.valueOf(-1, 1).denom);
                            }
                        }
                    }
                }
            });
        });
    });
});
