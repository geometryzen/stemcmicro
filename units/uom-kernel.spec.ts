import assert from 'assert';
import { Dimensions, QQ, Uom } from 'math-expression-atoms';

const Rat0 = QQ.valueOf(0, 1);
const Rat1 = QQ.valueOf(1, 1);
const Rat2 = QQ.valueOf(2, 1);

const ONE = Uom.ONE;
const KILOGRAM = Uom.KILOGRAM;
const METER = Uom.METER;
const SECOND = Uom.SECOND;
const AMPERE = Uom.AMPERE;
const COULOMB = Uom.COULOMB;
const KELVIN = Uom.KELVIN;
const MOLE = Uom.MOLE;
const CANDELA = Uom.CANDELA;

const NEWTON = KILOGRAM.mul(METER).div(SECOND).div(SECOND);
const JOULE = NEWTON.mul(METER);
const HERTZ = ONE.div(SECOND);
const WATT = JOULE.div(SECOND);
const VOLT = JOULE.div(COULOMB);
const WEBER = VOLT.mul(SECOND);
const TESLA = WEBER.div(METER).div(METER);
const OHM = VOLT.div(AMPERE);
const SIEMEN = AMPERE.div(VOLT);
const FARAD = COULOMB.div(VOLT);
const HENRY = KILOGRAM.mul(METER).mul(METER).div(COULOMB).div(COULOMB);
const PASCAL = NEWTON.div(METER).div(METER);

describe("Unit", function () {
    const symbols = ["kg", "m", "s", "C", "K", "mol", "cd"];

    it("Construction", function () {
        const meter = new Uom(new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        assert.strictEqual(meter.toString(void 0, true), "m");
    });

    describe("toString", function () {
        it("(..., true)", function () {
            const dimensionless = new Uom(new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
            assert.strictEqual(ONE.toString(void 0, true), "");
            assert.strictEqual(METER.toString(void 0, true), "m");
            assert.strictEqual(KILOGRAM.toString(void 0, true), "kg");
            assert.strictEqual(SECOND.toString(void 0, true), "s");
            assert.strictEqual(AMPERE.toString(10, true), "A");
            assert.strictEqual(COULOMB.toString(10, true), "C");
            assert.strictEqual(KELVIN.toString(10, true), "K");
            assert.strictEqual(MOLE.toString(10, true), "mol");
            assert.strictEqual(CANDELA.toString(10, true), "cd");
            assert.strictEqual(dimensionless.toString(10, true), "");
        });
        it("(..., false)", function () {
            const dimensionless = new Uom(new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
            assert.strictEqual(ONE.toString(void 0, false), "1");
            assert.strictEqual(METER.toString(void 0, false), "m");
            assert.strictEqual(KILOGRAM.toString(void 0, false), "kg");
            assert.strictEqual(SECOND.toString(void 0, false), "s");
            assert.strictEqual(AMPERE.toString(10, false), "A");
            assert.strictEqual(COULOMB.toString(10, false), "C");
            assert.strictEqual(KELVIN.toString(10, false), "K");
            assert.strictEqual(MOLE.toString(10, false), "mol");
            assert.strictEqual(CANDELA.toString(10, false), "cd");
            assert.strictEqual(dimensionless.toString(10, false), "1");
        });
    });
    it("mul by Unit", function () {
        const meter = new Uom(new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const second = new Uom(new Dimensions(Rat0, Rat0, Rat1, Rat0, Rat0, Rat0, Rat0), symbols);
        const areaUnit = meter.mul(second);
        assert.strictEqual(meter.toString(void 0, true), "m");
        assert.strictEqual(second.toString(void 0, true), "s");
        assert.strictEqual(areaUnit.toString(void 0, true), "m s");
    });
    it("div by Unit", function () {
        const meter = new Uom(new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const second = new Uom(new Dimensions(Rat0, Rat0, Rat1, Rat0, Rat0, Rat0, Rat0), symbols);
        const speedUnit = meter.div(second);
        assert.strictEqual(meter.toString(void 0, true), "m");
        assert.strictEqual(second.toString(void 0, true), "s");
        assert.strictEqual(speedUnit.toString(10, true), "m/s");
    });
    it("pow by number", function () {
        const meter = new Uom(new Dimensions(Rat0, Rat1, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        const square = meter.pow(Rat2);
        // const radian = new Unit(1, new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        assert.strictEqual(meter.toString(void 0, true), "m");
        assert.strictEqual(square.toString(void 0, true), "m ** 2");
    });
    it("inverse", function () {
        // const dimensionless = new Unit(1234, new Dimensions(Rat0, Rat0, Rat0, Rat0, Rat0, Rat0, Rat0), symbols);
        assert.strictEqual(ONE.inv().toString(void 0, true), "");
        assert.strictEqual(METER.inv().toString(void 0, true), "m ** -1");
        assert.strictEqual(KILOGRAM.inv().toString(void 0, true), "kg ** -1");
        assert.strictEqual(SECOND.inv().toString(10, true), "Hz");
        assert.strictEqual(AMPERE.inv().toString(void 0, true), "s C ** -1");
        assert.strictEqual(KELVIN.inv().toString(void 0, true), "K ** -1");
        assert.strictEqual(MOLE.inv().toString(void 0, true), "mol ** -1");
        assert.strictEqual(CANDELA.inv().toString(void 0, true), "cd ** -1");
    });
    it("electric current", function () {
        assert.strictEqual(AMPERE.toString(10, true), "A");
    });
    it("electric charge", function () {
        assert.strictEqual(COULOMB.toString(10, true), "C");
    });
    it("force", function () {
        assert.strictEqual(NEWTON.toString(10, true), "N");
    });
    it("energy", function () {
        assert.strictEqual(JOULE.toString(10, true), "J");
    });
    it("frequency", function () {
        assert.strictEqual(HERTZ.toString(10, true), "Hz");
    });
    it("power", function () {
        assert.strictEqual(WATT.toString(10, true), "W");
    });
    it("electric potential", function () {
        assert.strictEqual(VOLT.toString(10, true), "V");
    });
    it("electric field strength", function () {
        assert.strictEqual(VOLT.div(METER).toString(10, true), "V/m");
    });
    it("magnetic flux", function () {
        assert.strictEqual(WEBER.toString(10, true), "Wb");
    });
    it("magnetic flux density", function () {
        assert.strictEqual(TESLA.toString(10, true), "T");
    });
    it("electrical resistance", function () {
        assert.strictEqual(OHM.toString(10, true), "Ω");
    });
    it("electrical conductance", function () {
        assert.strictEqual(SIEMEN.toString(10, true), "S");
    });
    it("electrical capacitance", function () {
        assert.strictEqual(FARAD.toString(10, true), "F");
    });
    it("electrical inductance", function () {
        assert.strictEqual(WEBER.div(AMPERE).toString(10, true), "H");
        assert.strictEqual(HENRY.toString(10, true), "H");
    });
    it("electric permittivity", function () {
        assert.strictEqual(FARAD.div(METER).toString(10, true), "F/m");
    });
    it("electric permeability", function () {
        assert.strictEqual(HENRY.div(METER).toString(10, true), "H/m");
    });
    it("pressure, stress", function () {
        assert.strictEqual(PASCAL.toString(10, true), "Pa");
    });
    it("angular momentum", function () {
        assert.strictEqual(JOULE.mul(SECOND).toString(10, true), "J·s");
    });
    it("dynamic viscosity", function () {
        assert.strictEqual(PASCAL.mul(SECOND).toString(10, true), "Pa·s");
    });
    it("moment of force", function () {
        // FIXME
        // assert.strictEqual(NEWTON.mul(METER).toString(), "N·m");
        assert.strictEqual(NEWTON.mul(METER).toString(10, true), "J");
    });
    it("surface tension", function () {
        assert.strictEqual(NEWTON.div(METER).toString(10, true), "N/m");
    });
    it("heat flux density", function () {
        assert.strictEqual(WATT.div(METER).div(METER).toString(10, true), "W/m ** 2");
    });
    it("heat capacity, entropy", function () {
        assert.strictEqual(JOULE.div(KELVIN).toString(10, true), "J/K");
    });
    it("energy density", function () {
        // This could be a J/m ** 3 but that's a pressure too.
        assert.strictEqual(JOULE.div(METER).div(METER).div(METER).toString(10, true), "Pa");
    });
    it("specific energy", function () {
        assert.strictEqual(JOULE.div(KILOGRAM).toString(10, true), "J/kg");
    });
    it("molar energy", function () {
        assert.strictEqual(JOULE.div(MOLE).toString(10, true), "J/mol");
    });
    it("electric charge density", function () {
        assert.strictEqual(COULOMB.div(METER).div(METER).div(METER).toString(10, true), "C/m ** 3");
    });
    it("exposure (x-rays and γ-rays)", function () {
        assert.strictEqual(COULOMB.div(KILOGRAM).toString(10, true), "C/kg");
    });
});
