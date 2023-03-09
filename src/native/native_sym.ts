import { create_sym, Sym } from "../tree/sym/Sym";
import { Native } from "./Native";

/**
 * Returns the appropriate symbol that is used for the concept.
 * @param concept 
 * @returns 
 */
export function native_sym(concept: Native): Sym {
    switch (concept) {
        // Constants (upper case)...
        case Native.E: return create_sym('math.e');
        case Native.IMU: return create_sym('unit-imaginary-number');
        case Native.MASH: return create_sym('math.MASH');
        case Native.NIL: return create_sym('nil');
        case Native.PI: return create_sym('math.PI');
        // Functions (lower case)...
        case Native.abs: return create_sym('math.abs');
        case Native.add: return create_sym('add');
        case Native.div: return create_sym('/');
        case Native.exp: return create_sym('exp');
        case Native.inner: return create_sym('inner');
        case Native.inv: return create_sym('inv');
        case Native.lco: return create_sym('<<');
        case Native.mul: return create_sym('*');
        case Native.outer: return create_sym('outer');
        case Native.pow: return create_sym('math.pow');
        case Native.rco: return create_sym('>>');
        case Native.sin: return create_sym('sin');
        case Native.sub: return create_sym('-');
        case Native.succ: return create_sym('succ');
        default: throw new Error(`${concept}`);
    }
}
