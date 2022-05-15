import { MATH_POW } from '../runtime/ns_math';
import { half, negOne } from '../tree/rat/Rat';
import { makeList } from '../tree/tree';

/**
 * imaginary unit, (power -1 1/2)
 */
export const imu = makeList(MATH_POW, negOne, half);
