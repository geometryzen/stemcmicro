import { Err } from "../../tree/err/Err";
import { U } from "../../tree/tree";
import { Uom } from "../../tree/uom/Uom";

export function uom(name: string): U {
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
            return new Err(`Unknown name ${name}`);
        }
    }
}