import { Uom } from "../../tree/uom/Uom";

export function create_uom(name: 'kilogram' | 'meter' | 'second' | 'coulomb' | 'ampere' | 'kelvin' | 'mole' | 'candela'): Uom {
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