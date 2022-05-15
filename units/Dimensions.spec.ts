import { assert } from 'chai';
import { Dimensions } from '../src/tree/uom/Dimensions';
import { QQ } from '../src/tree/uom/QQ';

const R0 = QQ.valueOf(0, 1);
const R1 = QQ.valueOf(1, 1);
const R2 = R1.add(R1);
const R3 = R2.add(R1);
const R4 = R3.add(R1);
const R5 = R4.add(R1);
const R6 = R5.add(R1);
const R7 = R6.add(R1);

describe("Dimensions", function () {
    describe("constructor", function () {
        it("properties match construction arguments", function () {
            const M = QQ.valueOf(2, 3);
            const L = QQ.valueOf(3, 5);
            const T = QQ.valueOf(5, 7);
            const Q = QQ.valueOf(7, 11);
            const temperature = QQ.valueOf(11, 13);
            const amount = QQ.valueOf(13, 17);
            const intensity = QQ.valueOf(17, 19);
            const x = new Dimensions(M, L, T, Q, temperature, amount, intensity);
            assert.strictEqual(x.M.numer, 2);
            assert.strictEqual(x.M.denom, 3);
            assert.strictEqual(x.L.numer, 3);
            assert.strictEqual(x.L.denom, 5);
            assert.strictEqual(x.T.numer, 5);
            assert.strictEqual(x.T.denom, 7);
            assert.strictEqual(x.Q.numer, 7);
            assert.strictEqual(x.Q.denom, 11);
            assert.strictEqual(x.temperature.numer, 11);
            assert.strictEqual(x.temperature.denom, 13);
            assert.strictEqual(x.amount.numer, 13);
            assert.strictEqual(x.amount.denom, 17);
            assert.strictEqual(x.intensity.numer, 17);
            assert.strictEqual(x.intensity.denom, 19);
        });
    });

    it("Construction(QQ)", function () {
        const M = QQ.valueOf(1, 1);
        const L = QQ.valueOf(2, 1);
        const T = QQ.valueOf(3, 1);
        const Q = QQ.valueOf(4, 1);
        const temperature = QQ.valueOf(5, 1);
        const amount = QQ.valueOf(6, 1);
        const intensity = QQ.valueOf(7, 1);
        const d = new Dimensions(M, L, T, Q, temperature, amount, intensity);
        assert.strictEqual(d.M.numer, 1);
        assert.strictEqual(d.M.denom, 1);
        assert.strictEqual(d.L.numer, 2);
        assert.strictEqual(d.L.denom, 1);
        assert.strictEqual(d.T.numer, 3);
        assert.strictEqual(d.T.denom, 1);
        assert.strictEqual(d.Q.numer, 4);
        assert.strictEqual(d.Q.denom, 1);
        assert.strictEqual(d.temperature.numer, 5);
        assert.strictEqual(d.temperature.denom, 1);
        assert.strictEqual(d.amount.numer, 6);
        assert.strictEqual(d.amount.denom, 1);
        assert.strictEqual(d.intensity.numer, 7);
        assert.strictEqual(d.intensity.denom, 1);
    });

    it("Construction(number)", function () {
        const d = new Dimensions(R1, R2, R3, R4, R5, R6, R7);
        assert.strictEqual(d.M.numer, 1);
        assert.strictEqual(d.M.denom, 1);
        assert.strictEqual(d.L.numer, 2);
        assert.strictEqual(d.L.denom, 1);
        assert.strictEqual(d.T.numer, 3);
        assert.strictEqual(d.T.denom, 1);
        assert.strictEqual(d.Q.numer, 4);
        assert.strictEqual(d.Q.denom, 1);
        assert.strictEqual(d.temperature.numer, 5);
        assert.strictEqual(d.temperature.denom, 1);
        assert.strictEqual(d.amount.numer, 6);
        assert.strictEqual(d.amount.denom, 1);
        assert.strictEqual(d.intensity.numer, 7);
        assert.strictEqual(d.intensity.denom, 1);
    });

    it("mul", function () {
        const M = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        const L = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        const T = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        const Q = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        const temperature = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        const amount = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        const intensity = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        const N = M.mul(L).mul(T).mul(Q).mul(temperature).mul(amount).mul(intensity);
        assert.strictEqual(N.M.numer, 1);
        assert.strictEqual(N.M.denom, 1);
        assert.strictEqual(N.L.numer, 1);
        assert.strictEqual(N.L.denom, 1);
        assert.strictEqual(N.Q.numer, 1);
        assert.strictEqual(N.Q.denom, 1);
        assert.strictEqual(N.temperature.numer, 1);
        assert.strictEqual(N.temperature.denom, 1);
        assert.strictEqual(N.amount.numer, 1);
        assert.strictEqual(N.amount.denom, 1);
        assert.strictEqual(N.intensity.numer, 1);
        assert.strictEqual(N.intensity.denom, 1);
    });

    it("div", function () {
        const one = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        const M = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        const L = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        const T = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        const Q = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        const temperature = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        const amount = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        const intensity = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        const N = one.div(M).div(L).div(T).div(Q).div(temperature).div(amount).div(intensity);
        assert.strictEqual(N.M.numer, -1);
        assert.strictEqual(N.M.denom, 1);
        assert.strictEqual(N.L.numer, -1);
        assert.strictEqual(N.L.denom, 1);
        assert.strictEqual(N.T.numer, -1);
        assert.strictEqual(N.T.denom, 1);
        assert.strictEqual(N.Q.numer, -1);
        assert.strictEqual(N.Q.denom, 1);
        assert.strictEqual(N.temperature.numer, -1);
        assert.strictEqual(N.temperature.denom, 1);
        assert.strictEqual(N.amount.numer, -1);
        assert.strictEqual(N.amount.denom, 1);
        assert.strictEqual(N.intensity.numer, -1);
        assert.strictEqual(N.intensity.denom, 1);
    });

    it("pow", function () {
        const base = new Dimensions(R1, R2, R3, R4, R5, R6, R7);
        const x = base.pow(R2);
        assert.strictEqual(x.M.numer, 2);
        assert.strictEqual(x.M.denom, 1);
        assert.strictEqual(x.L.numer, 4);
        assert.strictEqual(x.L.denom, 1);
        assert.strictEqual(x.T.numer, 6);
        assert.strictEqual(x.T.denom, 1);
        assert.strictEqual(x.Q.numer, 8);
        assert.strictEqual(x.Q.denom, 1);
        assert.strictEqual(x.temperature.numer, 10);
        assert.strictEqual(x.temperature.denom, 1);
        assert.strictEqual(x.amount.numer, 12);
        assert.strictEqual(x.amount.denom, 1);
        assert.strictEqual(x.intensity.numer, 14);
        assert.strictEqual(x.intensity.denom, 1);
        assert.strictEqual(base.M.numer, 1);
        assert.strictEqual(base.M.denom, 1);
        assert.strictEqual(base.L.numer, 2);
        assert.strictEqual(base.L.denom, 1);
        assert.strictEqual(base.T.numer, 3);
        assert.strictEqual(base.T.denom, 1);
        assert.strictEqual(base.Q.numer, 4);
        assert.strictEqual(base.Q.denom, 1);
        assert.strictEqual(base.temperature.numer, 5);
        assert.strictEqual(base.temperature.denom, 1);
        assert.strictEqual(base.amount.numer, 6);
        assert.strictEqual(base.amount.denom, 1);
        assert.strictEqual(base.intensity.numer, 7);
        assert.strictEqual(base.intensity.denom, 1);
    });

    it("sqrt", function () {
        const quad = new Dimensions(R1, R2, R3, R2, R2, R2, R2);
        const x = quad.sqrt();
        assert.strictEqual(x.M.numer, 1);
        assert.strictEqual(x.M.denom, 2);
        assert.strictEqual(x.L.numer, 1);
        assert.strictEqual(x.L.denom, 1);
        assert.strictEqual(x.T.numer, 3);
        assert.strictEqual(x.T.denom, 2);
        assert.strictEqual(x.Q.numer, 1);
        assert.strictEqual(x.Q.denom, 1);
        assert.strictEqual(x.temperature.numer, 1);
        assert.strictEqual(x.temperature.denom, 1);
        assert.strictEqual(x.amount.numer, 1);
        assert.strictEqual(x.amount.denom, 1);
        assert.strictEqual(x.intensity.numer, 1);
        assert.strictEqual(x.intensity.denom, 1);
        assert.strictEqual(quad.M.numer, 1);
        assert.strictEqual(quad.M.denom, 1);
        assert.strictEqual(quad.L.numer, 2);
        assert.strictEqual(quad.L.denom, 1);
        assert.strictEqual(quad.T.numer, 3);
        assert.strictEqual(quad.T.denom, 1);
        assert.strictEqual(quad.Q.numer, 2);
        assert.strictEqual(quad.Q.denom, 1);
        assert.strictEqual(quad.temperature.numer, 2);
        assert.strictEqual(quad.temperature.denom, 1);
        assert.strictEqual(quad.amount.numer, 2);
        assert.strictEqual(quad.amount.denom, 1);
        assert.strictEqual(quad.intensity.numer, 2);
        assert.strictEqual(quad.intensity.denom, 1);
    });

    it("compatible", function () {
        const one = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        const all = new Dimensions(R1, R1, R1, R1, R1, R1, R1);
        const mass = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        const length = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        const time = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        const charge = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        const temperature = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        const amount = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        const intensity = new Dimensions(R0, R0, R0, R0, R0, R0, R1);

        function inCompatible(a: Dimensions, b: Dimensions): string {
            try {
                a.compatible(b);
                return `Something is rotten in Denmark!!! ${a.toString()} ${b.toString()}`;
            }
            catch (e) {
                if (e instanceof Error) {
                    return (<Error>e).message;
                }
                else {
                    return `Expecting an Error for ${a.toString()} ${b.toString()}`;
                }
            }
        }

        assert.strictEqual(one.compatible(one), one);
        assert.strictEqual(all.compatible(all), all);
        assert.strictEqual(mass.compatible(mass), mass);
        assert.strictEqual(length.compatible(length), length);
        assert.strictEqual(time.compatible(time), time);
        assert.strictEqual(charge.compatible(charge), charge);
        assert.strictEqual(temperature.compatible(temperature), temperature);
        assert.strictEqual(amount.compatible(amount), amount);
        assert.strictEqual(intensity.compatible(intensity), intensity);

        assert.strictEqual(inCompatible(one, length), 'Dimensions must be equal (dimensionless, length)');
        assert.strictEqual(inCompatible(length, one), 'Dimensions must be equal (length, dimensionless)');
        assert.strictEqual(inCompatible(mass, length), 'Dimensions must be equal (mass, length)');
        assert.strictEqual(inCompatible(length, mass), 'Dimensions must be equal (length, mass)');
    });

    it("isOne()", function () {
        assert.strictEqual(new Dimensions(R0, R0, R0, R0, R0, R0, R0).isOne(), true);
        assert.strictEqual(new Dimensions(R1, R0, R0, R0, R0, R0, R0).isOne(), false);
        assert.strictEqual(new Dimensions(R0, R1, R0, R0, R0, R0, R0).isOne(), false);
        assert.strictEqual(new Dimensions(R0, R0, R1, R0, R0, R0, R0).isOne(), false);
        assert.strictEqual(new Dimensions(R0, R0, R0, R1, R0, R0, R0).isOne(), false);
        assert.strictEqual(new Dimensions(R0, R0, R0, R0, R1, R0, R0).isOne(), false);
        assert.strictEqual(new Dimensions(R0, R0, R0, R0, R0, R1, R0).isOne(), false);
        assert.strictEqual(new Dimensions(R0, R0, R0, R0, R0, R0, R1).isOne(), false);
    });

    it("inv()", function () {
        const dims = new Dimensions(R1, R2, R3, R4, R5, R6, R7).inv();
        assert.strictEqual(dims.M.numer, -1);
        assert.strictEqual(dims.M.denom, 1);
        assert.strictEqual(dims.L.numer, -2);
        assert.strictEqual(dims.L.denom, 1);
        assert.strictEqual(dims.T.numer, -3);
        assert.strictEqual(dims.T.denom, 1);
        assert.strictEqual(dims.Q.numer, -4);
        assert.strictEqual(dims.Q.denom, 1);
        assert.strictEqual(dims.temperature.numer, -5);
        assert.strictEqual(dims.temperature.denom, 1);
        assert.strictEqual(dims.amount.numer, -6);
        assert.strictEqual(dims.amount.denom, 1);
        assert.strictEqual(dims.intensity.numer, -7);
        assert.strictEqual(dims.intensity.denom, 1);
    });

    it("toString()", function () {
        assert.strictEqual(`${new Dimensions(R0, R0, R0, R0, R0, R0, R0)}`, "");
        assert.strictEqual(`${new Dimensions(R1, R0, R0, R0, R0, R0, R0)}`, "mass");
        assert.strictEqual(`${new Dimensions(R2, R0, R0, R0, R0, R0, R0)}`, "mass ** 2");

        assert.strictEqual("" + (new Dimensions(R0, R1, R0, R0, R0, R0, R0)), "length");
        assert.strictEqual("" + (new Dimensions(R0, R0, R1, R0, R0, R0, R0)), "time");
        assert.strictEqual("" + (new Dimensions(R0, R0, R0, R1, R0, R0, R0)), "charge");
        assert.strictEqual("" + (new Dimensions(R0, R0, R0, R0, R1, R0, R0)), "thermodynamic temperature");
        assert.strictEqual("" + (new Dimensions(R0, R0, R0, R0, R0, R1, R0)), "amount of substance");
        assert.strictEqual("" + (new Dimensions(R0, R0, R0, R0, R0, R0, R1)), "luminous intensity");

        assert.strictEqual("" + (new Dimensions(R0, R1, QQ.valueOf(-2, 1), R0, R0, R0, R0)), "length * time ** -2");
    });
});
