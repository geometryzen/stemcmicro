import { QQ, Uom } from "math-expression-atoms";

const NEWTON = Uom.KILOGRAM.mul(Uom.METER).div(Uom.SECOND).div(Uom.SECOND);
const JOULE = NEWTON.mul(Uom.METER);
const WATT = JOULE.div(Uom.SECOND);
const VOLT = JOULE.div(Uom.COULOMB);
const TESLA = NEWTON.div(Uom.COULOMB).div(Uom.METER.div(Uom.SECOND));
const OHM = VOLT.div(Uom.AMPERE);
const FARAD = Uom.COULOMB.div(VOLT);
const HENRY = OHM.mul(Uom.SECOND);
const WEBER = HENRY.mul(Uom.AMPERE);
const HERTZ = Uom.ONE.div(Uom.SECOND);
const PASCAL = JOULE.div(Uom.METER.pow(QQ.valueOf(3, 1)));
const SIEMENS = Uom.ONE.div(OHM);

export type TYPE_UOM_NAME =
    'ampere' |
    'candela' |
    'coulomb' |
    'farad' |
    'henry' |
    'hertz' |
    'joule' |
    'kelvin' |
    'kilogram' |
    'meter' |
    'metre' |
    'mole' |
    'newton' |
    'ohm' |
    'pascal' |
    'second' |
    'siemens' |
    'tesla' |
    'volt' |
    'watt' |
    'weber';

export const UOM_NAMES: TYPE_UOM_NAME[] = ['ampere', 'candela', 'coulomb', 'farad', 'henry', 'hertz', 'joule', 'kelvin', 'kilogram', 'meter', 'metre', 'mole', 'newton', 'ohm', 'pascal', 'second', 'siemens', 'tesla', 'volt', 'watt', 'weber'];

const units: Map<TYPE_UOM_NAME, Uom> = new Map();

units.set('ampere', Uom.AMPERE);
units.set('candela', Uom.CANDELA);
units.set('coulomb', Uom.COULOMB);
units.set('farad', FARAD);
units.set('henry', HENRY);
units.set('hertz', HERTZ);
units.set('joule', JOULE);
units.set('kelvin', Uom.KELVIN);
units.set('kilogram', Uom.KILOGRAM);
units.set('meter', Uom.METER);
units.set('metre', Uom.METER);
units.set('mole', Uom.MOLE);
units.set('newton', NEWTON);
units.set('ohm', OHM);
units.set('pascal', PASCAL);
units.set('second', Uom.SECOND);
units.set('siemens', SIEMENS);
units.set('tesla', TESLA);
units.set('volt', VOLT);
units.set('watt', WATT);
units.set('weber', WEBER);

export function is_uom_name(name: string): name is TYPE_UOM_NAME {
    return units.has(name as TYPE_UOM_NAME);
}

export function create_uom(name: TYPE_UOM_NAME): Uom {
    if (units.has(name)) {
        return units.get(name) as Uom;
    }
    else {
        throw new Error(`Unknown name ${name}`);
    }
}