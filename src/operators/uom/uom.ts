import { Uom } from "../../tree/uom/Uom";

export type TYPE_UOM_NAME = 'kilogram' | 'meter' | 'second' | 'coulomb' | 'ampere' | 'kelvin' | 'mole' | 'candela';

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
        default: {
            throw new Error(`Unknown name ${name}`);
        }
    }
}