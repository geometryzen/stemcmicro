import { Uom } from "math-expression-atoms";

const NEWTON = Uom.KILOGRAM.mul(Uom.METER).div(Uom.SECOND).div(Uom.SECOND);
const JOULE = NEWTON.mul(Uom.METER);
const WATT = JOULE.div(Uom.SECOND);
const VOLT = JOULE.div(Uom.COULOMB);
const TESLA = NEWTON.div(Uom.COULOMB).div(Uom.METER.div(Uom.SECOND));

export type TYPE_UOM_NAME = 'kilogram' | 'meter' | 'second' | 'coulomb' | 'ampere' | 'kelvin' | 'mole' | 'candela' | 'newton' | 'joule' | 'watt' | 'volt' | 'tesla';

export function is_uom_name(name: string): name is TYPE_UOM_NAME {
    switch (name) {
        case 'kilogram': {
            return true;
        }
        case 'meter': {
            return true;
        }
        case 'second': {
            return true;
        }
        case 'coulomb': {
            return true;
        }
        case 'ampere': {
            return true;
        }
        case 'kelvin': {
            return true;
        }
        case 'mole': {
            return true;
        }
        case 'candela': {
            return true;
        }
        case 'newton': {
            return true;
        }
        case 'joule': {
            return true;
        }
        case 'watt': {
            return true;
        }
        case 'volt': {
            return true;
        }
        case 'tesla': {
            return true;
        }
        default: {
            return false;
        }
    }
}

export function create_uom(name: TYPE_UOM_NAME): Uom {
    switch (name) {
        case 'kilogram': {
            return Uom.KILOGRAM;
        }
        case 'meter': {
            return Uom.METER;
        }
        case 'second': {
            return Uom.SECOND;
        }
        case 'coulomb': {
            return Uom.COULOMB;
        }
        case 'ampere': {
            return Uom.AMPERE;
        }
        case 'kelvin': {
            return Uom.KELVIN;
        }
        case 'mole': {
            return Uom.MOLE;
        }
        case 'candela': {
            return Uom.CANDELA;
        }
        case 'newton': {
            return NEWTON;
        }
        case 'joule': {
            return JOULE;
        }
        case 'watt': {
            return WATT;
        }
        case 'volt': {
            return VOLT;
        }
        case 'tesla': {
            return TESLA;
        }
        default: {
            throw new Error(`Unknown name ${name}`);
        }
    }
}