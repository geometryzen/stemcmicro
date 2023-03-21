import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { Native } from '../../native/Native';
import { native_sym } from '../../native/native_sym';
import { Err } from '../../tree/err/Err';
import { create_flt } from '../../tree/flt/Flt';
import { items_to_cons, U } from '../../tree/tree';

// power function for double precision floating point
export function dpow(base: number, expo: number, $: ExtensionEnv): U {

    if (base === 0.0 && expo < 0.0) {
        // throw new Error('divide by zero');
        return new Err(items_to_cons(native_sym(Native.pow), create_flt(base), create_flt(expo)));
    }

    // nonnegative base or integer power?
    if (base >= 0.0 || expo % 1.0 === 0.0) {
        return create_flt(Math.pow(base, expo));
    }

    const result = Math.pow(Math.abs(base), expo);

    const theta = Math.PI * expo;

    let a = 0.0;
    let b = 0.0;
    // this ensures the real part is 0.0 instead of a tiny fraction
    if (expo % 0.5 === 0.0) {
        a = 0.0;
        b = Math.sin(theta);
    }
    else {
        a = Math.cos(theta);
        b = Math.sin(theta);
    }

    return $.add(create_flt(a * result), $.multiply(create_flt(b * result), imu));
}
